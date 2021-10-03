"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
const prosemirror_model_1 = require("prosemirror-model");
const prosemirror_dropcursor_1 = require("prosemirror-dropcursor");
const prosemirror_gapcursor_1 = require("prosemirror-gapcursor");
const prosemirror_keymap_1 = require("prosemirror-keymap");
const prosemirror_commands_1 = require("prosemirror-commands");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const inputrules_js_1 = require("./lib/inputrules.js");
class Editor {
    constructor(options = {}) {
        this.options = Object.assign({ extensions: [], viewAttributes: { role: "textbox", "aria-multiline": "true" } }, options);
        this.nodes = this.options.nodes || Editor.Nodes(this.options.extensions);
        this.marks = this.options.marks || Editor.Marks(this.options.extensions);
        this.schema = this.options.schema || Editor.Schema({ nodes: this.nodes, marks: this.marks, topNode: this.options.topNode });
        this.plugins = Editor.Plugins(this.options.extensions, this.schema);
        this.keymaps = Editor.Keymaps(this.options.extensions, this.schema);
        this.inputRules = Editor.InputRules(this.options.extensions, this.schema);
        const doc = this.options.content ? this.schema.nodeFromJSON(this.options.content) : this.schema.topNodeType.createAndFill();
        const selection = this.createSelection(doc, this.options.selection);
        this.state = Editor.EditorState({ doc, selection, schema: this.schema, plugins: this.defaultPlugins(), storedMarks: [] });
        this.view = Editor.EditorView({
            editor: this,
            place: this.options.place,
            state: this.state,
            nodeViews: Editor.NodeViews(this.options.extensions),
            editable: this.options.editable,
            viewAttributes: this.options.viewAttributes,
            handleDOMEvents: this.options.handleDOMEvents,
        });
        this.commands = Editor.Commands(this.options.extensions, this.schema, this.view);
    }
    static Nodes(nodes) {
        return nodes.reduce((nodes, extension) => extension.type === "node" ? (Object.assign(Object.assign({}, nodes), { [extension.name]: extension })) : nodes, {});
    }
    static Marks(marks) {
        return marks.reduce((marks, extension) => extension.type === "mark" ? (Object.assign(Object.assign({}, marks), { [extension.name]: extension })) : marks, {});
    }
    static Schema({ topNode, nodes, marks }) {
        return new prosemirror_model_1.Schema({ topNode, nodes, marks });
    }
    static Plugins(extensions, schema) {
        return extensions.reduce((plugins, extension) => {
            if (extension instanceof prosemirror_state_1.Plugin) {
                return plugins.concat([extension]);
            }
            if (extension.plugins) {
                return plugins.concat(extension.plugins({
                    schema,
                    nodeType: extension.type === "node" ? schema.nodes[extension.name] : undefined,
                    markType: extension.type === "mark" ? schema.marks[extension.name] : undefined,
                }));
            }
            return plugins;
        }, []);
    }
    static Keymaps(extensions, schema) {
        const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false;
        return extensions.reduce((keymaps, extension) => (extension instanceof prosemirror_state_1.Plugin || !extension.keymap) ? keymaps :
            keymaps.concat((0, prosemirror_keymap_1.keymap)(extension.keymap({
                schema,
                nodeType: extension.type === "node" ? schema.nodes[extension.name] : undefined,
                markType: extension.type === "mark" ? schema.marks[extension.name] : undefined,
                mac,
            }))), []);
    }
    static InputRules(extensions, schema) {
        return extensions.reduce((inputRules, extension) => (extension instanceof prosemirror_state_1.Plugin || !extension.inputRules) ? inputRules :
            inputRules.concat(...extension.inputRules({
                schema,
                nodeType: extension.type === "node" ? schema.nodes[extension.name] : undefined,
                markType: extension.type === "mark" ? schema.marks[extension.name] : undefined,
            })), []);
    }
    static Commands(extensions, schema, view) {
        return extensions
            .reduce((commands, extension) => {
            if (extension instanceof prosemirror_state_1.Plugin || !extension.commands)
                return commands;
            function apply(callback, attrs) {
                callback(attrs)(view.state, view.dispatch, view);
                view.focus();
            }
            function bind(key, command) {
                commands[key] = attrs => apply(command, attrs);
            }
            Object.entries(extension.commands({
                schema,
                nodeType: extension.type === "node" ? schema.nodes[extension.name] : undefined,
                markType: extension.type === "mark" ? schema.marks[extension.name] : undefined,
            })).forEach(([name, command]) => bind(name, command));
            return commands;
        }, {});
    }
    static EditorView({ place, state, nodeViews, editable, viewAttributes, handleDOMEvents, editor }) {
        return new prosemirror_view_1.EditorView(place, {
            state,
            nodeViews,
            editable: state => typeof editable === 'function' && editable(state) || editable,
            attributes: state => {
                const editview = typeof editable === 'function' && editable(state) || editable;
                return Object.assign({ class: `ProseMirror-${state.doc.type.name}` }, editview && viewAttributes);
            },
            handleDOMEvents,
            dispatchTransaction: function (transaction) {
                const { state, transactions } = this.state.applyTransaction(transaction);
                this.updateState(state);
                editor.state = this.state;
                editor.options.onChange && transactions.some(tr => tr.docChanged) && editor.options.onChange(transaction);
            }
        });
    }
    static EditorState({ schema, doc, selection, storedMarks, plugins }) {
        return prosemirror_state_1.EditorState.create({ schema, doc, selection, storedMarks, plugins });
    }
    defaultPlugins() {
        return [
            (0, inputrules_js_1.inputRules)({ rules: this.inputRules }),
            (0, prosemirror_keymap_1.keymap)({ Backspace: prosemirror_inputrules_1.undoInputRule }),
            ...this.plugins,
            ...this.keymaps,
            (0, prosemirror_keymap_1.keymap)(prosemirror_commands_1.baseKeymap),
            (0, prosemirror_dropcursor_1.dropCursor)({ class: "ProseMirror-dropcursor", color: 'currentColor' }),
            (0, prosemirror_gapcursor_1.gapCursor)(),
        ];
    }
    createSelection(doc, selection) {
        return selection && (!("toJSON" in selection) ? prosemirror_state_1.Selection.fromJSON(doc, selection) : selection);
    }
    static NodeViews(extensions) {
        return extensions.reduce((views, extension) => {
            if (extension instanceof prosemirror_state_1.Plugin)
                return views;
            if (extension.type === "node" && extension.nodeView) {
                const nodeView = (node, view, getPos, decorations, innerDecorations) => extension.nodeView({ node, view, getPos, decorations, innerDecorations });
                views[extension.name] = nodeView;
            }
            if (extension.type === "mark" && extension.markView) {
                const markView = (mark, view, inline) => extension.markView({ mark, view, inline });
                views[extension.name] = markView;
            }
            return views;
        }, {});
    }
    destroy() {
        this.view.destroy();
    }
    setContentAndSelection(content, selection) {
        const doc = content ? this.schema.nodeFromJSON(content) : this.schema.topNodeType.createAndFill();
        selection = this.createSelection(doc, selection);
        const state = this.view.state;
        const nextState = prosemirror_state_1.EditorState.create({ schema: state.schema, doc, selection, storedMarks: state.storedMarks, plugins: state.plugins });
        this.view.updateState(nextState);
    }
    static Text(state) {
        let doc = state.doc;
        return doc.textBetween(0, doc.content.size, '\n');
    }
    static HTML(state) {
        let div = document.createElement('div');
        div.appendChild(prosemirror_model_1.DOMSerializer.fromSchema(state.schema).serializeFragment(state.doc.content));
        return div.innerHTML;
    }
    static fromHTML(html, schema, parseOptions) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return prosemirror_model_1.DOMParser.fromSchema(schema).parse(div, parseOptions);
    }
    static JSON(state) {
        return state.doc.toJSON();
    }
    get Text() {
        return Editor.Text(this.view.state);
    }
    get HTML() {
        return Editor.HTML(this.view.state);
    }
    get JSON() {
        return Editor.JSON(this.view.state);
    }
}
exports.Editor = Editor;
