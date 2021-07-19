import type { NodeView } from "prosemirror-view"
import type { Node as PMNode } from "prosemirror-model"
import Node, { CustomNodeViewProps } from "../Node"

export default class TitleView implements NodeView {
  dom: HTMLElement;
  contentDOM: HTMLElement;
  extension: Node;
  node: PMNode;

  constructor(props: CustomNodeViewProps) {
    this.extension = props.extension as Node;
    this.node = props.node;
    this.extension.options.handleTitleChange(this.node.textContent)
    const titleDiv = document.createElement("h1")
    titleDiv.classList.add("title")
    this.dom = this.contentDOM = titleDiv
  }

  update (node: PMNode): boolean {
    if (node.type !== this.node.type) return false;
    this.node.textContent !== node.textContent && this.extension.options.handleTitleChange(node.textContent)
    this.node = node;
    return true
  }
}