import type { NodeView } from "prosemirror-view"
import type { Node as PMNode } from "prosemirror-model"
import { NodeViewProps } from "../../Node.js"
import type { Node } from "../../Node.js"

export default class TitleView implements NodeView {
  dom: HTMLElement;
  contentDOM: HTMLElement;
  node: PMNode;
  options: any;

  constructor(props: NodeViewProps, options) {
    this.node = props.node;
    const titleDiv = document.createElement("h1")
    titleDiv.classList.add("title")
    this.dom = this.contentDOM = titleDiv
  }

  update (node: PMNode): boolean {
    if (node.type !== this.node.type) return false;
    this.node.textContent !== node.textContent && this.options.handleTitleChange(node.textContent)
    this.node = node;
    return true
  }
}