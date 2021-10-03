"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HeadingView {
    constructor(props, options) {
        this.options = options;
        this.node = props.node;
        this.dom = this.contentDOM = document.createElement(`h${this.node.attrs.level}`);
        this.options.modifyDOM && this.options.modifyDOM(this.node, this.dom);
    }
    update(node) {
        if (node.type !== this.node.type)
            return false;
        this.node = node;
        this.options.modifyDOM && this.options.modifyDOM(this.node, this.dom);
        return true;
    }
}
exports.default = HeadingView;
