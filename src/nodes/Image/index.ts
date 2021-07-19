import Node from "../Node"
import type { EditorView } from "prosemirror-view"
import { Plugin } from "prosemirror-state"
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import { removeEmptyAttrs } from "../../utils"

/**
 * https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
 */
export default class Image extends Node {

  get name() {
    return "image"
  }
  
  get schema(): NodeSpec {
    return {
      attrs: {src: {default: null}, alt: {default: null}, title: {default: null}, align: {default: 'center'}},
      inline: false,
      group: "block",
      draggable: true,
      parseDOM: [{
        tag: "img[src]", 
        getAttrs(img: HTMLImageElement) { 
          return {src: img.src, alt: img.alt, title: img.title, align: img.dataset.align}; 
        }
      }],
      toDOM(node: PMNode) { 
        const {align, ...attrs} = removeEmptyAttrs(node.attrs); 
        return ["img", {'data-align': align, ...attrs}]; 
      }
    }
  }

  commands({nodeType}) {
    return attrs => (state, dispatch) => {
      const { selection } = state
      const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos
      const node = nodeType.create(attrs)
      const transaction = state.tr.insert(position, node)
      dispatch(transaction)
    }
  }

  get plugins() {
    const uploadImage = this.options.uploadImage;
    return [

    ]
  }
}