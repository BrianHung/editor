import type { Node as PMNode, NodeSpec, NodeType, Schema } from "prosemirror-model"
import type { NodeView, EditorView, Decoration, DecorationSet } from "prosemirror-view"
import type { Command, Keymap } from "prosemirror-commands"
import type { InputRule } from "prosemirror-inputrules"
import type { Plugin } from "prosemirror-state"

export interface Node extends NodeSpec {
  type: 'node'
  name: string
  nodeView?: (props: NodeViewProps) => NodeView
  plugins?: (props?: {schema: Schema, nodeType: NodeType}) => Plugin[]
  inputRules?: (props?: {schema: Schema, nodeType: NodeType}) => InputRule[]
  commands?: (props?: {schema: Schema, nodeType: NodeType}) => Record<string, (props: any) => Command>
  keymap?: (props?: {schema: Schema, nodeType: NodeType, mac: boolean}) => Keymap
  [key: string]: any
}

export type CustomNodeView = (node: PMNode, view: EditorView, getPos: () => number, decorations: Decoration[], innerDecorations: DecorationSet) => NodeView

export interface NodeViewProps {
  node: PMNode
  view: EditorView
  getPos: () => number
  decorations: Decoration[]
  innerDecorations: DecorationSet
} 

/**
 * Utility function for implementing a NodeSpec, which the editor turns into a PMNode.
 * https://prosemirror.net/docs/ref/#model.NodeSpec
 * https://prosemirror.net/docs/ref/#model.Node
 */
export const Node = (options: Partial<Node>): Node => ({type: 'node', name: options.name, ...options})