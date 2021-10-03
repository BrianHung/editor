import type { Node, NodeViewProps } from '../../Node.js'
import type { Node as PMNode } from "prosemirror-model";
import type { NodeView } from 'prosemirror-view';

export default class CodeBlockNodeView implements NodeView {

  dom: HTMLElement;
  contentDOM: HTMLElement;
  node: PMNode;
  lineNumbers: HTMLElement;

  constructor (props: NodeViewProps) {
    this.node = props.node;

    this.dom = document.createElement("pre");
    this.dom.classList.add("codeblock");
    this.node.attrs.lang && (this.dom.dataset.lang = this.node.attrs.lang);

    this.contentDOM = document.createElement("code");
    this.contentDOM.spellcheck = false;

    this.lineNumbers = document.createElement("div");
    this.lineNumbers.classList.add("linenumbers");

    this.dom.appendChild(this.lineNumbers);
    this.dom.appendChild(this.contentDOM);

  }

  update (node: PMNode): boolean {
    if (node.type !== this.node.type) { return false; }
    if (node.attrs.lang && node.attrs.lang !== this.node.attrs.lang) {
      this.dom.dataset.lang = node.attrs.lang; 
    }
    this.node = node;
    return true;
  }
}