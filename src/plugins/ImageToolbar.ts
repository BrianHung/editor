import type { EditorView } from "prosemirror-view"
import { Plugin, PluginKey, NodeSelection } from "prosemirror-state"
import type { EditorState } from "prosemirror-state"
import type { Node as PMNode } from "prosemirror-model"

/**
 * Extensible tooltip to update image nodes when selected.
 * Based on tooltip example: https://prosemirror.net/examples/tooltip/.
 * 
 * TODO: move nodePos state into pluginState and make plugin more extensible
 * to internal and external positioning logic (e.g. TippyJS).
 */
class ImageToolbarView {

  options: Record<string, any>;
  view: EditorView;
  toolbar: HTMLElement | null;
  nodePos: {node: PMNode, pos: number} | null;

  constructor(options, view: EditorView) {
    this.options = {mount: true, style: {position: "absolute", "z-index": 10, width: "fit-content", left: 0, right: 0, margin: "auto"}, ...options};
    this.view = view;

    this.toolbar = document.createElement("div");
    this.toolbar.className = "ProseMirror-image-toolbar";
    Object.assign(this.toolbar.style, this.options.style, {display: "none"});

    const alignments = ["center", "breakout", "cover"];
    alignments.forEach(alignment => {

      const button = this.toolbar.appendChild(document.createElement("button"));
      button.innerText = alignment;
      button.setAttribute('aria-label', `${alignment} image`);

      // prevent default behavior of button focus + editor blur
      button.onmousedown = event => event.preventDefault(); 
      button.onclick = event => {
        if (!this.nodePos) { return }
        event.preventDefault();
        const {pos, node} = this.nodePos;

        let attrs = {...node.attrs}
        if (attrs.align === alignment) {
          delete attrs.align
        } else {
          attrs.align = alignment
        }
        console.log("attrs", attrs, attrs.align, attrs.align === alignment)
        view.dispatch(view.state.tr.setNodeMarkup(pos, null, attrs));
      }

    })

    if (this.options.mount && view.dom.parentNode && !this.toolbar.parentNode)
      view.dom.parentNode.insertBefore(this.toolbar, view.dom.nextSibling)
  }


  update(view: EditorView, prevState: EditorState) {
    this.view = view;

    if (this.options.mount && view.dom.parentNode && !this.toolbar.parentNode) {
      view.dom.parentNode.insertBefore(this.toolbar, view.dom.nextSibling);
    }

    // Return when no change in document or selection AND toolbar is visible.
    if (prevState && prevState.doc.eq(view.state.doc) && prevState.selection.eq(view.state.selection) && this.nodePos) {
      return
    }

    // @ts-ignore
    const {from, to, node} = view.state.selection;

    // Hide toolbar if selection is not NodeSelection on an image node.
    if (!(view.state.selection instanceof NodeSelection) || (node.type != view.state.schema.nodes.image)) {
      this.toolbar.style.display = "none";
      this.nodePos = null;
      return
    }

    // Keep node and pos for handlers.
    this.nodePos = {node, pos: from};
    let start = view.coordsAtPos(from), end = view.coordsAtPos(to);

    // Reset dom style so that offsetParent is defined if ImageToolbar is mounted onto dom.
    this.toolbar.style.display = "";

    if (this.toolbar.offsetParent == null) {
      return
    }
    
    const imageMarginBottom = window.getComputedStyle(view.nodeDOM(from) as Element).marginBottom;

    // The box in which the tooltip is positioned, to use as base reference.
    const box = this.toolbar.offsetParent.getBoundingClientRect()
    this.toolbar.style.bottom = `${box.bottom - end.top + parseInt(imageMarginBottom)}px` // place at end of image

    // Update class of currently active alignment.

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
};

export const ImageToolbarKey = new PluginKey("ImageToolbar");

export default function ImageToolbarPlugin(options?): Plugin {
  return new Plugin({
    key: ImageToolbarKey,
    view(editorView) { 
      return new ImageToolbarView(options, editorView); 
    },
  })
};