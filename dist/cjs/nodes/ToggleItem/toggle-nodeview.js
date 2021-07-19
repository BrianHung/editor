"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ToggleItemView {
    constructor(props) {
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
            let toggled = event.target.checked;
            this.view.dispatch(this.view.state.tr.setNodeMarkup(this.getPos(), null, { toggled }));
        };
        this.dom.dataset.toggled = this.checkbox.checked = this.node.attrs.toggled;
        this.contentDOM = this.dom.appendChild(document.createElement("div"));
        this.contentDOM.classList.add("toggle-content");
    }
    update(node) {
        if (node.type !== this.node.type) {
            return false;
        }
        this.node = node;
        this.dom.dataset.content = this.node.childCount !== 1 ? "" : null;
        this.dom.dataset.toggled = this.checkbox.checked = this.node.attrs.toggled;
        return true;
    }
}
exports.default = ToggleItemView;
