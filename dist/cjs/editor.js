"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const inputrules_1 = require("./lib/inputrules");
const Extension_1 = __importDefault(require("./extensions/Extension"));
const Node_1 = __importDefault(require("./nodes/Node"));
const Mark_1 = __importDefault(require("./marks/Mark"));
class Editor {
    constructor(options = {}) {
        this.options = Object.assign({ editable: true, extensions: [], topNode: 'doc', viewAttributes: { role: "textbox", "aria-multiline": "true" } }, options);
        this.nodes = this.options.nodes || Editor.createNodes(this.options.extensions);
        this.marks = this.options.marks || Editor.createMarks(this.options.extensions);
        this.schema = this.options.schema || Editor.createSchema({ nodes: this.nodes, marks: this.marks, topNode: this.options.topNode });
        this.plugins = Editor.createPlugins(this.options.extensions);
        this.keymaps = Editor.createKeymaps(this.options.extensions, this.schema);
        this.inputRules = Editor.createInputRules(this.options.extensions, this.schema);
        const doc = this.options.content ? this.schema.nodeFromJSON(this.options.content) : this.schema.topNodeType.createAndFill();
        const selection = this.createSelection(doc, this.options.selection);
        this.state = Editor.createEditorState({ doc, selection, schema: this.schema, plugins: this.defaultPlugins(), storedMarks: [] });
        this.view = this.createEditorView();
        this.commands = this.createCommands();
    }
    static createNodes(nodes) {
        return nodes
            .filter(extension => extension instanceof Extension_1.default && extension.type === "node")
            .reduce((nodes, node) => (Object.assign(Object.assign({}, nodes), { [node.name]: node.schema })), {});
    }
    static createMarks(marks) {
        return marks
            .filter(extension => extension instanceof Extension_1.default && extension.type === "mark")
            .reduce((marks, mark) => (Object.assign(Object.assign({}, marks), { [mark.name]: mark.schema })), {});
    }
    static createSchema({ topNode, nodes, marks }) {
        return new prosemirror_model_1.Schema({
            topNode,
            nodes,
            marks
        });
    }
    static createPlugins(extensions) {
        return extensions.filter(extension => (extension instanceof Extension_1.default && extension.plugins) || extension instanceof prosemirror_state_1.Plugin)
            .reduce((plugins, extension) => extension instanceof Extension_1.default ? plugins.concat(extension.plugins) : plugins.concat([extension]), []);
    }
    static createKeymaps(extensions, schema) {
        return extensions.filter(extension => extension instanceof Extension_1.default && extension.keys)
            .map(extension => extension.keys({
            schema,
            nodeType: extension instanceof Node_1.default ? schema[`${extension.type}s`][extension.name] : undefined,
            markType: extension instanceof Mark_1.default ? schema[`${extension.type}s`][extension.name] : undefined,
        }))
            .map(keys => prosemirror_keymap_1.keymap(keys));
    }
    static createInputRules(extensions, schema) {
        return extensions.filter(extension => extension instanceof Extension_1.default && extension.inputRules)
            .reduce((inputRules, extension) => inputRules.concat(...extension.inputRules({
            schema,
            nodeType: extension instanceof Node_1.default ? schema[`${extension.type}s`][extension.name] : undefined,
            markType: extension instanceof Mark_1.default ? schema[`${extension.type}s`][extension.name] : undefined,
        })), []);
    }
    createCommands() {
        const schema = this.schema, view = this.view;
        return this.options.extensions.filter(extension => extension instanceof Extension_1.default && extension.commands)
            .reduce((commands, extension) => {
            const value = extension.commands({
                schema,
                nodeType: extension instanceof Node_1.default ? schema[`${extension.type}s`][extension.name] : undefined,
                markType: extension instanceof Mark_1.default ? schema[`${extension.type}s`][extension.name] : undefined,
            });
            const apply = (callback, attrs) => {
                callback(attrs)(view.state, view.dispatch, view);
                view.focus();
            };
            const setCommand = (name, command) => {
                if (Array.isArray(command)) {
                    commands[name] = attrs => command.forEach(callback => apply(callback, attrs));
                }
                else if (typeof command === 'function') {
                    commands[name] = attrs => apply(command, attrs);
                }
            };
            typeof value === 'function' ? setCommand(extension.name, value) : Object.entries(value).forEach(([name, command]) => setCommand(name, command));
            return commands;
        }, {});
    }
    createEditorView() {
        const editor = this;
        return new prosemirror_view_1.EditorView(this.options.place, {
            state: this.state,
            nodeViews: Editor.createNodeViews(this.options.extensions),
            editable: state => typeof this.options.editable == 'function' && this.options.editable(state) || this.options.editable,
            attributes: state => {
                const editable = typeof this.options.editable == 'function' && this.options.editable(state) || this.options.editable;
                return Object.assign({ class: `ProseMirror-${state.doc.type.name}` }, editable && this.options.viewAttributes);
            },
            handleDOMEvents: this.options.handleDOMEvents,
            dispatchTransaction: function (transaction) {
                const { state, transactions } = this.state.applyTransaction(transaction);
                this.updateState(state);
                editor.state = this.state;
                editor.options.onChange && transactions.some(tr => tr.docChanged) && editor.options.onChange(transaction);
            }
        });
    }
    static createEditorState({ schema, doc, selection, storedMarks, plugins }) {
        return prosemirror_state_1.EditorState.create({
            schema,
            doc,
            selection,
            storedMarks,
            plugins,
        });
    }
    defaultPlugins() {
        return [
            inputrules_1.inputRules({ rules: this.inputRules }),
            prosemirror_keymap_1.keymap({ Backspace: prosemirror_inputrules_1.undoInputRule }),
            ...this.plugins,
            ...this.keymaps,
            prosemirror_keymap_1.keymap(prosemirror_commands_1.baseKeymap),
            prosemirror_dropcursor_1.dropCursor({ class: "ProseMirror-dropcursor", color: 'currentColor' }),
            prosemirror_gapcursor_1.gapCursor(),
        ];
    }
    createSelection(doc, selection) {
        return selection && (!("toJSON" in selection) ? prosemirror_state_1.Selection.fromJSON(doc, selection) : selection);
    }
    static createNodeViews(extensions) {
        return extensions.filter(ext => (ext instanceof Node_1.default || ext instanceof Mark_1.default) && ext.customNodeView)
            .reduce((customNodeViews, extension) => (Object.assign({ [extension.name]: (node, view, getPos, decorations) => extension.customNodeView({ extension, node, view, getPos, decorations }) }, customNodeViews)), {});
    }
    destroy() {
        this.view.destroy();
    }
    setContentAndSelection(content, selection) {
        const doc = content ? this.schema.nodeFromJSON(content) : this.schema.topNodeType.createAndFill();
        const state = this.view.state;
        const nextState = prosemirror_state_1.EditorState.create({ schema: state.schema, doc, selection, storedMarks: state.storedMarks, plugins: state.plugins });
        this.view.updateState(nextState);
    }
    get Text() {
        let doc = this.view.state.doc;
        return doc.textBetween(0, doc.content.size, "\n");
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
    get HTML() {
        return Editor.HTML(this.view.state);
    }
    get JSON() {
        return Editor.JSON(this.view.state);
    }
}
exports.Editor = Editor;
