import Node from './Node'
import type { NodeSpec } from "prosemirror-model";
export default class Figure extends Node {
  get name() {
    return "figure";
  }
  get schema(): NodeSpec {
    return {
      /**
       * The HTML <figure> (Figure With Optional Caption) element represents self-contained content, potentially with an optional caption, which is specified using the <figcaption> element. 
       * The figure, its caption, and its contents are referenced as a single unit. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
       */
      content: "image+ figcaption?",
      group: "block",
      parseDOM: [{
        tag: "figure",
        getAttrs(dom: HTMLElement) {
          return dom.querySelector("img[src]") ? {} : false; // check for an image element
        },
      }],
      toDOM() { 
        return ["figure", 0] 
      }
    };
  }
}
