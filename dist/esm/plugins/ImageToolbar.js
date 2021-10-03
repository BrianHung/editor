import { Plugin, PluginKey, NodeSelection } from "prosemirror-state";
class ImageToolbarView {
    constructor(options, view) {
        this.options = Object.assign({ mount: true, style: { position: "absolute", "z-index": 10, width: "fit-content", left: 0, right: 0, margin: "auto" } }, options);
        this.view = view;
        this.toolbar = document.createElement("div");
        this.toolbar.className = "ProseMirror-image-toolbar";
        Object.assign(this.toolbar.style, this.options.style, { display: "none" });
        const alignments = ["center", "breakout", "cover"];
        alignments.forEach(alignment => {
            const button = this.toolbar.appendChild(document.createElement("button"));
            button.innerText = alignment;
            button.setAttribute('aria-label', `${alignment} image`);
            button.onmousedown = event => event.preventDefault();
            button.onclick = event => {
                if (!this.nodePos) {
                    return;
                }
                event.preventDefault();
                const { pos, node } = this.nodePos;
                let attrs = Object.assign({}, node.attrs);
                if (attrs.align === alignment) {
                    delete attrs.align;
                }
                else {
                    attrs.align = alignment;
                }
                console.log("attrs", attrs, attrs.align, attrs.align === alignment);
                view.dispatch(view.state.tr.setNodeMarkup(pos, null, attrs));
            };
        });
        if (this.options.mount && view.dom.parentNode && !this.toolbar.parentNode)
            view.dom.parentNode.insertBefore(this.toolbar, view.dom.nextSibling);
    }
    update(view, prevState) {
        this.view = view;
        if (this.options.mount && view.dom.parentNode && !this.toolbar.parentNode) {
            view.dom.parentNode.insertBefore(this.toolbar, view.dom.nextSibling);
        }
        if (prevState && prevState.doc.eq(view.state.doc) && prevState.selection.eq(view.state.selection) && this.nodePos) {
            return;
        }
        const { from, to, node } = view.state.selection;
        if (!(view.state.selection instanceof NodeSelection) || (node.type != view.state.schema.nodes.image)) {
            this.toolbar.style.display = "none";
            this.nodePos = null;
            return;
        }
        this.nodePos = { node, pos: from };
        let start = view.coordsAtPos(from), end = view.coordsAtPos(to);
        this.toolbar.style.display = "";
        if (this.toolbar.offsetParent == null) {
            return;
        }
        const imageMarginBottom = window.getComputedStyle(view.nodeDOM(from)).marginBottom;
        const box = this.toolbar.offsetParent.getBoundingClientRect();
        this.toolbar.style.bottom = `${box.bottom - end.top + parseInt(imageMarginBottom)}px`;
        const aligns = ["center", "breakout", "cover"];
        const index = aligns.indexOf(node.attrs.align);
        Array.from(this.toolbar.children).forEach((button, i) => {
            button.classList.toggle("ProseMirror-menu-active", index == i);
        });
    }
    destroy() {
        if (this.options.mount && this.view.dom.parentNode)
            this.toolbar.remove();
    }
}
;
export const ImageToolbarKey = new PluginKey("ImageToolbar");
export default function ImageToolbarPlugin(options) {
    return new Plugin({
        key: ImageToolbarKey,
        view(editorView) {
            return new ImageToolbarView(options, editorView);
        },
    });
}
;
