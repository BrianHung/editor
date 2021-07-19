import { EditorState, Plugin, Selection, TextSelection, Transaction } from 'prosemirror-state'
import { EditorView, Decoration } from 'prosemirror-view'
import type { NodeView } from 'prosemirror-view'
import { Schema, DOMParser, DOMSerializer, Node as PMNode, Mark as PMMark, NodeSpec, MarkSpec, SchemaSpec } from 'prosemirror-model'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import { undoInputRule, InputRule } from 'prosemirror-inputrules'

// extension of 'prosemirror-inputrules' to handle matches on return
import { inputRules } from "./lib/inputrules"

import Extension from "./extensions/Extension"
import NodeInstance from "./nodes/Node"
import MarkInstance from "./marks/Mark"

/**
 * Minimal wrapper around ProseMirror methods to initialize an editor view.
 * Some static methods are exposed to allow for more end-user flexibility.
 */

export class Editor {

  view: EditorView;
  state: EditorState;
  schema: Schema;
  plugins: Plugin[];
  keymaps: Plugin[];
  inputRules: InputRule[];
  nodes: { [name: string]: NodeSpec };
  marks: { [name: string]: MarkSpec };
  commands: Record<string, any>;

  options: {
    place?: Node | ((p: Node) => void) | { mount: Node };
    editorProps?: Record<string, any>;
    editable?: boolean | Function;
    extensions: (Extension | Plugin)[];
    content?: {type: string, content: any};
    selection?: JSON | Selection;
    topNode?: string;
    nodes?: { [name: string]: NodeSpec } | null,
    marks?: { [name: string]: MarkSpec } | null,
    schema?: Schema | null,
    parseOptions?: Record<string, any>;
    onChange?: Function;
    handleDOMEvents?: {[name: string]: (view: EditorView<any>, event: Event) => boolean;}
    viewAttributes?: Record<string, string>;
  };

  constructor(options = {}) {

    this.options = {
      editable: true,
      extensions: [],
      topNode: 'doc',
      viewAttributes: {role: "textbox", "aria-multiline": "true"},
      ...options,
    }

    this.nodes = this.options.nodes || Editor.createNodes(this.options.extensions);
    this.marks = this.options.marks || Editor.createMarks(this.options.extensions);
    this.schema = this.options.schema || Editor.createSchema({nodes: this.nodes, marks: this.marks, topNode: this.options.topNode});

    this.plugins = Editor.createPlugins(this.options.extensions);
    this.keymaps = Editor.createKeymaps(this.options.extensions, this.schema);

    this.inputRules = Editor.createInputRules(this.options.extensions, this.schema);

    const doc = this.options.content ? this.schema.nodeFromJSON(this.options.content) : this.schema.topNodeType.createAndFill();
    const selection = this.createSelection(doc, this.options.selection);
    this.state = Editor.createEditorState({doc, selection, schema: this.schema, plugins: this.defaultPlugins(), storedMarks: []})

    this.view = this.createEditorView();
    this.commands = this.createCommands();
  }

  /**
   * Gather map of node schemas.
   * 
   * Ideally, end-user will know not to pass ProseMirror plugins into this function
   * because plugins do not contain node schemas.
   */
  static createNodes(nodes: (Extension | Plugin)[]): { [name: string]: NodeSpec } {
    return nodes
      .filter(extension => extension instanceof Extension && extension.type === "node")
      .reduce((nodes, node: NodeInstance) => ({...nodes, [node.name]: node.schema}), {})
  }

  /**
   * Gather map of mark schemas.
   * 
   * Ideally, end-user will know not to pass ProseMirror plugins into this function
   * because plugins do not contain mark schemas.
   */
  static createMarks(marks: (Extension | Plugin)[]): { [name: string]: MarkSpec } {
    return marks
      .filter(extension => extension instanceof Extension && extension.type === "mark")
      .reduce((marks, mark: MarkInstance) => ({...marks, [mark.name]: mark.schema}), {})
  }

  /**
   * Admittedly an unnecessarily shallow wrapper on top of ProseMirror 
   * but it avoids end-user having to import prosemirror-model.
   * 
   * https://prosemirror.net/docs/ref/#model.Document_Schema
   */
  static createSchema({topNode, nodes, marks}): Schema {
    return new Schema({
      topNode, 
      nodes, 
      marks
    });
  }

  /**
   * Gather array of ProseMirror plugins.
   */
  static createPlugins(extensions: (Extension | Plugin)[]): Plugin[] {
    return extensions.filter(extension => (extension instanceof Extension && extension.plugins) || extension instanceof Plugin)
      .reduce((plugins, extension: Extension | Plugin) => extension instanceof Extension ? plugins.concat(extension.plugins) : plugins.concat([extension as Plugin]), [])
  }

  static createKeymaps(extensions: (Extension | Plugin)[], schema: Schema): Plugin[] {
    return (extensions.filter(extension => extension instanceof Extension && extension.keys) as Extension[])
      .map(extension => extension.keys({
        schema,
        nodeType: extension instanceof NodeInstance ? schema[`${extension.type}s`][extension.name] : undefined,
        markType: extension instanceof MarkInstance ? schema[`${extension.type}s`][extension.name] : undefined,
      }))
      .map(keys => keymap(keys))
  }

  static createInputRules(extensions: (Extension | Plugin)[], schema: Schema): InputRule[] {
    return (extensions.filter(extension => extension instanceof Extension && extension.inputRules) as Extension[])
      .reduce((inputRules, extension) => inputRules.concat(...extension.inputRules({
        schema,
        nodeType: extension instanceof NodeInstance ? schema[`${extension.type}s`][extension.name] : undefined,
        markType: extension instanceof MarkInstance ? schema[`${extension.type}s`][extension.name] : undefined,
      }))
      , [])
  }

  createCommands() {
    const schema = this.schema, view = this.view
    return (this.options.extensions.filter(extension => extension instanceof Extension && extension.commands) as Extension[])
      .reduce((commands, extension) => {
        const value = extension.commands({
          schema,
          nodeType: extension instanceof NodeInstance ? schema[`${extension.type}s`][extension.name] : undefined,
          markType: extension instanceof MarkInstance ? schema[`${extension.type}s`][extension.name] : undefined,
        })
        const apply = (callback, attrs) => {
          callback(attrs)(view.state, view.dispatch, view)
          view.focus()
        }

        // An individual command can be a function, or an array of commands to apply successively.
        const setCommand = (name, command) => {
          if (Array.isArray(command)) {
            commands[name] = attrs => command.forEach(callback => apply(callback, attrs))
          } else if (typeof command === 'function') {
            commands[name] = attrs => apply(command, attrs)
          }
        }

        // An extension can define a single command, or a Record<string, commands>.
        // @ts-ignore
        typeof value === 'function' ? setCommand(extension.name, value) : Object.entries(value).forEach(([name, command]) => setCommand(name, command))
        return commands
      }, {})
  }

  // https://prosemirror.net/docs/ref/#view.EditorView.constructor
  createEditorView() {

    const editor = this;
    return new EditorView(this.options.place, {

      state: this.state,
      nodeViews: Editor.createNodeViews(this.options.extensions),
      
      editable: state => typeof this.options.editable == 'function' && this.options.editable(state) || this.options.editable,
      attributes: state => {
        const editable = typeof this.options.editable == 'function' && this.options.editable(state) || this.options.editable
        return {
          class: `ProseMirror-${state.doc.type.name}`,
          ...editable && this.options.viewAttributes,
        }
      },
      
      handleDOMEvents: this.options.handleDOMEvents,

      // "The callback will be bound to have the view instance as its this binding."
      dispatchTransaction: function(transaction: Transaction) {
        const {state, transactions} = this.state.applyTransaction(transaction);
        this.updateState(state);
        editor.state = this.state;
        editor.options.onChange && transactions.some(tr => tr.docChanged) && editor.options.onChange(transaction);
      }
    });
  }

  /**
   * Admittedly an unnecessarily shallow wrapper on top of ProseMirror 
   * but it avoids end-user having to import prosemirror-state.
   * 
   * https://prosemirror.net/docs/ref/#state.EditorState^create
   */
  static createEditorState({schema, doc, selection, storedMarks, plugins}) {
    return EditorState.create({
      schema,
      doc,
      selection,
      storedMarks,
      plugins,
    })
  }

  defaultPlugins() {
    return [
      // Prioritize inputRules over plugin keymaps over baseKeymap.
      inputRules({rules: this.inputRules}),
      keymap({Backspace: undoInputRule}),
      ...this.plugins,
      ...this.keymaps,
      keymap(baseKeymap),
      // @ts-ignore
      dropCursor({class: "ProseMirror-dropcursor", color: 'currentColor'}),
      gapCursor(),
    ]
  }

  // internal method to convert this.options.selection to a valid Selection
  createSelection(doc: PMNode, selection: undefined | JSON | Selection): Selection {
    return selection && (!("toJSON" in selection) ? Selection.fromJSON(doc, selection) : selection);
  }

  // https://prosemirror.net/docs/ref/#view.EditorProps.nodeViews
  static createNodeViews(extensions: (Extension | Plugin)[]): { [name: string]: () => NodeView } {
    return extensions.filter(ext => (ext instanceof NodeInstance || ext instanceof MarkInstance) && ext.customNodeView)
      .reduce((customNodeViews, extension: NodeInstance | MarkInstance) => ({
        [extension.name]: (node, view, getPos, decorations) => extension.customNodeView({extension, node, view, getPos, decorations}),
        ...customNodeViews, 
      }), {});
  }

  destroy() {
    this.view.destroy()
  }

  setContentAndSelection(content: {type: string, content: any} | null, selection: Selection | null) {
    const doc = content ? this.schema.nodeFromJSON(content) : this.schema.topNodeType.createAndFill();
    const state = this.view.state;
    const nextState = EditorState.create({schema: state.schema, doc, selection, storedMarks: state.storedMarks, plugins: state.plugins});
    this.view.updateState(nextState)
  }

  get Text(): string {
    let doc = this.view.state.doc;
    return doc.textBetween(0, doc.content.size, "\n");
  }

  static HTML(state: EditorState): string {
    let div = document.createElement('div');
    div.appendChild(DOMSerializer.fromSchema(state.schema).serializeFragment(state.doc.content));
    return div.innerHTML;
  }

  static fromHTML(html: string, schema: Schema, parseOptions) {
    const div = document.createElement('div')
    div.innerHTML = html;
    return DOMParser.fromSchema(schema).parse(div, parseOptions);  
  }

  static JSON(state: EditorState) {
    return state.doc.toJSON();
  }

  get HTML(): string {
    return Editor.HTML(this.view.state);
  }

  get JSON() {
    return Editor.JSON(this.view.state);
  }
}