import type { NodeView, EditorView } from "prosemirror-view"
import type { Node as PMNode } from "prosemirror-model"
import type { NodeViewProps } from '../../Node.js'

export default class ToggleItemView implements NodeView {

  dom: HTMLElement;
  contentDOM: HTMLElement;
  node: PMNode;
  view: EditorView;
  getPos: () => number;
  checkbox: HTMLInputElement;

  constructor(props: NodeViewProps) {
    this.node = props.node;
    this.view = props.view;
    this.getPos = props.getPos;

    this.dom = document.createElement("li");
    this.dom.classList.add("toggle-item");
    this.dom.dataset.content = this.node.childCount !== 1 ? "" : null;

    this.checkbox = this.dom.appendChild(document.createElement("input"));
    this.checkbox.classList.add("toggle-checkbox");
    this.checkbox.type = "checkbox";
    this.checkbox.contentEditable = "false";
    this.checkbox.onmousedown = event => event.preventDefault();
    this.checkbox.onclick = event => {
      let toggled = (event.target as HTMLInputElement).checked;
      this.view.dispatch(this.view.state.tr.setNodeMarkup(this.getPos(), null, {toggled}));
    }

    this.dom.dataset.toggled = this.checkbox.checked = this.node.attrs.toggled;
    this.contentDOM = this.dom.appendChild(document.createElement("div"));
    this.contentDOM.classList.add("toggle-content");
  }

  update (node: PMNode): boolean {
    if (node.type !== this.node.type) { return false; }
    this.node = node;
    this.dom.dataset.content = this.node.childCount !== 1 ? "" : null;
    this.dom.dataset.toggled = this.checkbox.checked = this.node.attrs.toggled;
    return true;
  }
}