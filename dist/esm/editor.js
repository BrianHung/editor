import { EditorState, Plugin, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { undoInputRule } from 'prosemirror-inputrules';
import { inputRules } from "./lib/inputrules";
import Extension from "./extensions/Extension";
import NodeInstance from "./nodes/Node";
import MarkInstance from "./marks/Mark";
export class Editor {
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
            .filter(extension => extension instanceof Extension && extension.type === "node")
            .reduce((nodes, node) => (Object.assign(Object.assign({}, nodes), { [node.name]: node.schema })), {});
    }
    static createMarks(marks) {
        return marks
            .filter(extension => extension instanceof Extension && extension.type === "mark")
            .reduce((marks, mark) => (Object.assign(Object.assign({}, marks), { [mark.name]: mark.schema })), {});
    }
    static createSchema({ topNode, nodes, marks }) {
        return new Schema({
            topNode,
            nodes,
            marks
        });
    }
    static createPlugins(extensions) {
        return extensions.filter(extension => (extension instanceof Extension && extension.plugins) || extension instanceof Plugin)
            .reduce((plugins, extension) => extension instanceof Extension ? plugins.concat(extension.plugins) : plugins.concat([extension]), []);
    }
    static createKeymaps(extensions, schema) {
        return extensions.filter(extension => extension instanceof Extension && extension.keys)
            .map(extension => extension.keys({
            schema,
            nodeType: extension instanceof NodeInstance ? schema[`${extension.type}s`][extension.name] : undefined,
            markType: extension instanceof MarkInstance ? schema[`${extension.type}s`][extension.name] : undefined,
        }))
            .map(keys => keymap(keys));
    }
    static createInputRules(extensions, schema) {
        return extensions.filter(extension => extension instanceof Extension && extension.inputRules)
            .reduce((inputRules, extension) => inputRules.concat(...extension.inputRules({
            schema,
            nodeType: extension instanceof NodeInstance ? schema[`${extension.type}s`][extension.name] : undefined,
            markType: extension instanceof MarkInstance ? schema[`${extension.type}s`][extension.name] : undefined,
        })), []);
    }
    createCommands() {
        const schema = this.schema, view = this.view;
        return this.options.extensions.filter(extension => extension instanceof Extension && extension.commands)
            .reduce((commands, extension) => {
            const value = extension.commands({
                schema,
                nodeType: extension instanceof NodeInstance ? schema[`${extension.type}s`][extension.name] : undefined,
                markType: extension instanceof MarkInstance ? schema[`${extension.type}s`][extension.name] : undefined,
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
        return new EditorView(this.options.place, {
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
        return EditorState.create({
            schema,
            doc,
            selection,
            storedMarks,
            plugins,
        });
    }
    defaultPlugins() {
        return [
            inputRules({ rules: this.inputRules }),
            keymap({ Backspace: undoInputRule }),
            ...this.plugins,
            ...this.keymaps,
            keymap(baseKeymap),
            dropCursor({ class: "ProseMirror-dropcursor", color: 'currentColor' }),
            gapCursor(),
        ];
    }
    createSelection(doc, selection) {
        return selection && (!("toJSON" in selection) ? Selection.fromJSON(doc, selection) : selection);
    }
    static createNodeViews(extensions) {
        return extensions.filter(ext => (ext instanceof NodeInstance || ext instanceof MarkInstance) && ext.customNodeView)
            .reduce((customNodeViews, extension) => (Object.assign({ [extension.name]: (node, view, getPos, decorations) => extension.customNodeView({ extension, node, view, getPos, decorations }) }, customNodeViews)), {});
    }
    destroy() {
        this.view.destroy();
    }
    setContentAndSelection(content, selection) {
        const doc = content ? this.schema.nodeFromJSON(content) : this.schema.topNodeType.createAndFill();
        const state = this.view.state;
        const nextState = EditorState.create({ schema: state.schema, doc, selection, storedMarks: state.storedMarks, plugins: state.plugins });
        this.view.updateState(nextState);
    }
    get Text() {
        let doc = this.view.state.doc;
        return doc.textBetween(0, doc.content.size, "\n");
    }
    static HTML(state) {
        let div = document.createElement('div');
        div.appendChild(DOMSerializer.fromSchema(state.schema).serializeFragment(state.doc.content));
        return div.innerHTML;
    }
    static fromHTML(html, schema, parseOptions) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return DOMParser.fromSchema(schema).parse(div, parseOptions);
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
