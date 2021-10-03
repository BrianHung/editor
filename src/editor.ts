import { EditorState, Plugin, Selection, Transaction } from 'prosemirror-state'
import type { NodeView } from 'prosemirror-view'
import { EditorView, Decoration } from 'prosemirror-view'
import { Schema, DOMParser, DOMSerializer, Node as PMNode, Mark as PMMark, NodeSpec, MarkSpec } from 'prosemirror-model'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { keymap } from 'prosemirror-keymap'
import type { Command, Keymap } from 'prosemirror-commands'
import { baseKeymap } from 'prosemirror-commands'
import { undoInputRule, InputRule } from 'prosemirror-inputrules'

// Internal fork of 'prosemirror-inputrules' to handle matches on enter key / return
import { inputRules } from "./lib/inputrules.js"

import type { Extension } from "./Extension.js"
import type { CustomNodeView, Node } from "./Node.js"
import type { CustomMarkView, Mark } from "./Mark.js"

type DOMNode = globalThis.Node
type Extensions = (Extension | Mark | Node | Plugin)[]

/**
 * Minimal wrapper around ProseMirror methods to initialize an editor.
 * Some static methods are exposed to allow for more end-user flexibility.
 * 
 * Library architecture mainly based on making more modular and extensible
 * https://github.com/ProseMirror/prosemirror-example-setup.
 */

export class Editor {

  view: EditorView
  state: EditorState
  schema: Schema
  plugins: Plugin[]
  keymaps: Plugin[]
  inputRules: InputRule[]
  nodes: Record<string, NodeSpec>
  marks: Record<string, MarkSpec>
  commands: Record<string, Command>

  options: {
    place?: DOMNode | ((p: DOMNode) => void) | { mount: DOMNode }
    editorProps?: Record<string, any>
    editable?: boolean | Function
    extensions: Extensions
    content?: {type: string, content: any}
    selection?: JSON | Selection
    topNode?: string
    nodes?: Record<string, NodeSpec> | null
    marks?: Record<string, MarkSpec> | null
    schema?: Schema | null
    parseOptions?: Record<string, any>
    onChange?: Function
    handleDOMEvents?: Record<string, (view: EditorView<any>, event: Event) => boolean>
    viewAttributes?: Record<string, string>
  }

  constructor(options = {}) {
    this.options = {
      extensions: [],
      viewAttributes: {role: "textbox", "aria-multiline": "true"},
      ...options,
    }

    this.nodes = this.options.nodes || Editor.Nodes(this.options.extensions)
    this.marks = this.options.marks || Editor.Marks(this.options.extensions)

    this.schema = this.options.schema || Editor.Schema({nodes: this.nodes, marks: this.marks, topNode: this.options.topNode})

    this.plugins = Editor.Plugins(this.options.extensions, this.schema)
    this.keymaps = Editor.Keymaps(this.options.extensions, this.schema)

    this.inputRules = Editor.InputRules(this.options.extensions, this.schema)

    const doc = this.options.content ? this.schema.nodeFromJSON(this.options.content) : this.schema.topNodeType.createAndFill()
    const selection = this.createSelection(doc, this.options.selection)

    this.state = Editor.EditorState({doc, selection, schema: this.schema, plugins: this.defaultPlugins(), storedMarks: []})
    
    this.view = Editor.EditorView({
      editor: this,
      place: this.options.place,
      state: this.state,
      nodeViews: Editor.NodeViews(this.options.extensions),
      editable: this.options.editable,
      viewAttributes: this.options.viewAttributes,
      handleDOMEvents: this.options.handleDOMEvents,
    })

    this.commands = Editor.Commands(this.options.extensions, this.schema, this.view)
  }

  /**
   * Gather map of node schemas while maintaining order extensions were passed in.
   * 
   * Ideally, end-user will know not to pass ProseMirror plugins into this function
   * because plugins do not contain node schemas.
   */
  static Nodes(nodes: Extensions): Record<string, NodeSpec> {
    return nodes.reduce((nodes, extension: any) => extension.type === "node" ? ({...nodes, [extension.name]: extension}) : nodes, {})
  }

  /**
   * Gather map of mark schemas while maintaining order extensions were passed in.
   * 
   * Ideally, end-user will know not to pass ProseMirror plugins into this function
   * because plugins do not contain mark schemas.
   */
  static Marks(marks: Extensions): Record<string, MarkSpec> {
    return marks.reduce((marks, extension: any) => extension.type === "mark" ? ({...marks, [extension.name]: extension}) : marks, {})
  }

  /**
   * Admittedly an unnecessarily shallow wrapper on top of ProseMirror 
   * but it avoids end-user having to import prosemirror-model.
   * 
   * https://prosemirror.net/docs/ref/#model.Document_Schema
   */
  static Schema({topNode, nodes, marks}): Schema {
    return new Schema({topNode, nodes, marks})
  }

  /**
   * Gather array of ProseMirror plugins.
   */
  static Plugins(extensions: Extensions, schema: Schema): Plugin[] {
    return extensions.reduce((plugins, extension) => {
      if (extension instanceof Plugin) {
        return plugins.concat([extension as Plugin])
      }
      if (extension.plugins) {
        return plugins.concat(extension.plugins({
          schema,
          nodeType: extension.type === "node" ? schema.nodes[extension.name] : undefined,
          markType: extension.type === "mark" ? schema.marks[extension.name] : undefined,
        }))
      }
      return plugins
    }, [])
  }

  static Keymaps(extensions: Extensions, schema: Schema): Plugin[] {
    /**
     * https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js
     * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/keymap.js
     */
    const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false
    return extensions.reduce((keymaps, extension) => (extension instanceof Plugin || !extension.keymap) ? keymaps :
      keymaps.concat(keymap(extension.keymap({
        schema,
        nodeType: extension.type === "node" ? schema.nodes[extension.name] : undefined,
        markType: extension.type === "mark" ? schema.marks[extension.name] : undefined,
        mac,
      })))
    , [])
  }

  static InputRules(extensions: Extensions, schema: Schema): InputRule[] {
    return extensions.reduce((inputRules, extension) => (extension instanceof Plugin || !extension.inputRules) ? inputRules : 
      inputRules.concat(...extension.inputRules({
        schema,
        nodeType: extension.type === "node" ? schema.nodes[extension.name] : undefined,
        markType: extension.type === "mark" ? schema.marks[extension.name] : undefined,
      }))
    , [])
  }

  /**
   * Creates a record of commands from extensions bounded to the given view.
   */
  static Commands(extensions: Extensions, schema: Schema, view: EditorView): { [key: string]: Command } {
    return extensions
      .reduce((commands, extension) => {
        if (extension instanceof Plugin || !extension.commands) return commands

        /**
         * Pass options to a higher-order function which returns a command,
         * and call that command on the given view state and dispatch.
         * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/menu.js
         */
        function apply(callback, attrs) {
          callback(attrs)(view.state, view.dispatch, view)
          view.focus()
        }

        /**
         * Utility function to bind multiple commands to same return object.
         * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/keymap.js
         */
        function bind(key, command) {
          commands[key] = attrs => apply(command, attrs)
        }

        Object.entries(extension.commands({
          schema,
          nodeType: extension.type === "node" ? schema.nodes[extension.name] : undefined,
          markType: extension.type === "mark" ? schema.marks[extension.name] : undefined,
        })).forEach(([name, command]) => bind(name, command))

        return commands
      }, {})
  }

  // https://prosemirror.net/docs/ref/#view.EditorView.constructor
  static EditorView({place, state, nodeViews, editable, viewAttributes, handleDOMEvents, editor}) {
    return new EditorView(place, {
      state,
      nodeViews,
      editable: state => typeof editable === 'function' && editable(state) || editable,
      attributes: state => {
        const editview = typeof editable === 'function' && editable(state) || editable
        return {
          class: `ProseMirror-${state.doc.type.name}`,
          ...editview && viewAttributes,
        }
      },
      
      handleDOMEvents,

      /**
       * "The callback will be bound to have the view instance as its this binding."
       * https://prosemirror.net/docs/ref/#view.DirectEditorProps.dispatchTransaction
       */
      dispatchTransaction: function(transaction: Transaction) {
        const {state, transactions} = this.state.applyTransaction(transaction)
        this.updateState(state)
        editor.state = this.state
        editor.options.onChange && transactions.some(tr => tr.docChanged) && editor.options.onChange(transaction)
      }
    })
  }

  /**
   * Admittedly an unnecessarily shallow wrapper on top of ProseMirror 
   * but it avoids end-user having to import prosemirror-state.
   * 
   * https://prosemirror.net/docs/ref/#state.EditorState^create
   */
  static EditorState({schema, doc, selection, storedMarks, plugins}) {
    return EditorState.create({schema, doc, selection, storedMarks, plugins})
  }

  defaultPlugins() {
    return [
      /**
       * Prioritize inputRules over plugin keymaps over baseKeymap.
       * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/index.js
       */
      inputRules({rules: this.inputRules}),
      keymap({Backspace: undoInputRule}),
      ...this.plugins,
      ...this.keymaps,
      keymap(baseKeymap),
      dropCursor({class: "ProseMirror-dropcursor", color: 'currentColor'}),
      gapCursor(),
    ]
  }

  // internal method to convert this.options.selection to a valid Selection
  createSelection(doc: PMNode, selection: undefined | JSON | Selection): Selection {
    return selection && (!("toJSON" in selection) ? Selection.fromJSON(doc, selection) : selection)
  }

  // https://prosemirror.net/docs/ref/#view.EditorProps.nodeViews
  static NodeViews(extensions: Extensions): Record<string, CustomNodeView | CustomMarkView> {
    return extensions.reduce((views, extension) => {
      if (extension instanceof Plugin) return views
      if (extension.type === "node" && extension.nodeView) {
        const nodeView: CustomNodeView = (node, view, getPos, decorations, innerDecorations) => extension.nodeView({node, view, getPos, decorations, innerDecorations})
        views[extension.name] = nodeView
      }
      if (extension.type === "mark" && extension.markView) {
        const markView: CustomMarkView = (mark, view, inline) => extension.markView({mark, view, inline})
        views[extension.name] = markView
      }
      return views
    }, {})
  }

  destroy() {
    this.view.destroy()
  }

  setContentAndSelection(content?: {type: string, content: any} | null, selection?: Selection | JSON | null) {
    const doc = content ? this.schema.nodeFromJSON(content) : this.schema.topNodeType.createAndFill()
    selection = this.createSelection(doc, selection)

    const state = this.view.state
    const nextState = EditorState.create({schema: state.schema, doc, selection, storedMarks: state.storedMarks, plugins: state.plugins})
    this.view.updateState(nextState)
  }

  static Text(state: EditorState): string {
    let doc = state.doc
    return doc.textBetween(0, doc.content.size, '\n')
  }

  static HTML(state: EditorState): string {
    let div = document.createElement('div')
    div.appendChild(DOMSerializer.fromSchema(state.schema).serializeFragment(state.doc.content))
    return div.innerHTML
  }

  static fromHTML(html: string, schema: Schema, parseOptions) {
    const div = document.createElement('div')
    div.innerHTML = html
    return DOMParser.fromSchema(schema).parse(div, parseOptions)
  }

  static JSON(state: EditorState) {
    return state.doc.toJSON()
  }

  get Text(): string {
    return Editor.Text(this.view.state)
  }

  get HTML(): string {
    return Editor.HTML(this.view.state)
  }

  get JSON() {
    return Editor.JSON(this.view.state)
  }
}