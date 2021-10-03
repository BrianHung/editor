"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TitleView {
    constructor(props, options) {
        this.node = props.node;
        const titleDiv = document.createElement("h1");
        titleDiv.classList.add("title");
        this.dom = this.contentDOM = titleDiv;
    }
    update(node) {
        if (node.type !== this.node.type)
            return false;
        this.node.textContent !== node.textContent && this.options.handleTitleChange(node.textContent);
        this.node = node;
        return true;
    }
}
exports.default = TitleView;
