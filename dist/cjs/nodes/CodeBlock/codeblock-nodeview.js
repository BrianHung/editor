"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CodeBlockNodeView {
    constructor(props) {
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
    update(node) {
        if (node.type !== this.node.type) {
            return false;
        }
        if (node.attrs.lang && node.attrs.lang !== this.node.attrs.lang) {
            this.dom.dataset.lang = node.attrs.lang;
        }
        this.node = node;
        return true;
    }
}
exports.default = CodeBlockNodeView;
