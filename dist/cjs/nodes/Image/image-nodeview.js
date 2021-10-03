"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageNodeView = void 0;
const removeEmptyValues_js_1 = require("../../utils/removeEmptyValues.js");
class ImageNodeView {
    constructor(props) {
        this.node = props.node;
        this.view = props.view;
        this.getPos = props.getPos;
        this.dom = document.createElement('div');
        this.dom.classList.add('ProseMirror-image-nodeview');
        this.dom.setAttribute('role', 'group');
        const button = this.dom.appendChild(document.createElement("button"));
        button.onmousedown = event => event.preventDefault();
        button.onclick = () => {
            const pos = this.getPos();
            this.view.dispatch(this.view.state.tr.delete(pos, pos + 1));
        };
        button.setAttribute("aria-label", "Remove media");
        this.image = this.dom.appendChild(document.createElement("img"));
        this.image.loading = "lazy";
        const _a = this.node.attrs, { align } = _a, attrs = __rest(_a, ["align"]);
        this.image.dataset.align = align;
        Object.assign(this.image, (0, removeEmptyValues_js_1.removeEmptyValues)(attrs));
        this.toolbar = this.dom.appendChild(document.createElement("div"));
        this.toolbar.className = "ProseMirror-image-toolbar";
        const alignments = ["center", "breakout", "cover"];
        ["center", "breakout", "cover"].forEach(alignment => {
            const button = this.toolbar.appendChild(document.createElement("button"));
            button.innerText = alignment;
            button.setAttribute('aria-label', `${alignment} image`);
            button.onmousedown = event => event.preventDefault();
            button.onclick = event => {
                event.preventDefault();
                let attrs = Object.assign({}, this.node.attrs);
                if (attrs.align === alignment) {
                    delete attrs.align;
                }
                else {
                    attrs.align = alignment;
                }
                console.log("attrs", attrs, attrs.align, attrs.align === alignment);
                this.view.dispatch(this.view.state.tr.setNodeMarkup(this.getPos(), null, attrs));
            };
        });
    }
    update(node) {
        if (this.node.type !== node.type) {
            return false;
        }
        this.node = node;
        const _a = this.node.attrs, { align } = _a, attrs = __rest(_a, ["align"]);
        this.image.dataset.align = align;
        console.log("align", align);
        Object.assign(this.image, (0, removeEmptyValues_js_1.removeEmptyValues)(attrs));
        return true;
    }
}
exports.ImageNodeView = ImageNodeView;
