import Node from './Node'
import type { NodeSpec, Schema } from "prosemirror-model";
export default class Video extends Node {
  get name() {
    return "video";
  }
  get schema(): NodeSpec {
    return {
      content: "source+",
      group: "block",
      parseDOM: [{
        tag: "video",
        getAttrs(dom: HTMLElement) {
          console.log("hi")
          return dom.querySelector("source") ? {} : false; // check for a source element
        }, 
      }],
      toDOM() { return ["video", 0] }
    };
  }
}
