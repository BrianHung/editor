import { Node } from "../../Node.js"
import type { Node as PMNode } from "prosemirror-model";
import { removeEmptyValues, canInsert } from "../../utils/index.js"

/**
 * https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
 */
export const Image = (options?: Partial<Node>) => Node({
  name: 'image',

  attrs: {src: {default: null}, alt: {default: null}, title: {default: null}, align: {default: 'center'}},
  inline: false,
  group: 'block',
  draggable: true,
  parseDOM: [{
    tag: 'img[src]', 
    getAttrs(img: HTMLImageElement) { 
      return {src: img.src, alt: img.alt, title: img.title, align: img.dataset.align}; 
    }
  }],
  toDOM(node: PMNode) { 
    const {align, ...attrs} = removeEmptyValues(node.attrs); 
    return ["img", {'data-align': align, ...attrs}]; 
  },

  /**
   * Taken from `enable` and `run`.
   * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/menu.js
   */
  commands({nodeType}) {
    return {
      image: attrs => (state, dispatch) => {
        if (!canInsert(state, nodeType)) return false
        dispatch(state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)))
        return true
      }
    }
  },

  ...options,
})