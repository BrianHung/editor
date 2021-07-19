import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import Node from "./Node";

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
 */
export default class Source extends Node {
  get name() {
    return "source";
  }
  get schema(): NodeSpec {
    return {
      attrs: {src: {default: undefined}, media: {default: undefined}, type: {default: undefined}},
      inline: false,
      group: "block",
      parseDOM: [{tag: "source"}],
      toDOM(node: PMNode) { return ["source", {...node.attrs}]; },
    };
  }
}