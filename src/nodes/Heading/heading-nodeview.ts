import type { Decoration, NodeView, EditorView } from "prosemirror-view"
import type { Node as PMNode } from "prosemirror-model"
import Node, { CustomNodeViewProps } from "../Node"

export default class HeadingView implements NodeView {

  dom: HTMLElement;
  contentDOM: HTMLElement;
  extension: Node;
  node: PMNode;

  constructor(props: CustomNodeViewProps) {
    this.extension = props.extension as Node;
    this.node = props.node;
    this.dom = this.contentDOM = document.createElement(`h${this.node.attrs.level}`)
    this.extension.options.modifyDOM && this.extension.options.modifyDOM(this.node, this.dom)
  }

  update (node: PMNode): boolean {
    if (node.type !== this.node.type) return false;
    this.node = node;
    this.extension.options.modifyDOM && this.extension.options.modifyDOM(this.node, this.dom)
    return true
  }
}