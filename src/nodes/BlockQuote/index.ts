  
import Node from "../Node";
import { toggleWrap } from "../../commands";
import { wrappingInputRule } from "prosemirror-inputrules";
import type { NodeSpec, Node as PMNode } from "prosemirror-model";
import { wrapIn } from "prosemirror-commands";

export default class BlockQuote extends Node {

  get name() {
    return "blockquote"
  }

  get schema(): NodeSpec {
    return {
      attrs: {type: {default: null}},
      content: "block+",
      group: "block",
      parseDOM: [{tag: "blockquote", getAttrs(div: HTMLDivElement) { return {type: div.dataset.type}; }}],
      toDOM(node: PMNode) { return ["blockquote", {...node.attrs.type && {'data-type': node.attrs.type}}, 0]; },
    };
  }

  inputRules({nodeType}) {
    return [
      wrappingInputRule(/^> $/, nodeType),
      wrappingInputRule(/^" $/, nodeType, {type: "pullquote"})
    ];
  }

  commands({nodeType}) {
    return {
      "blockquote": () => toggleWrap(nodeType),
      "pullquote": () => toggleWrap(nodeType, {type: "pullquote"}),
    }
  }

  keys({nodeType}) {
    return {
      'Ctrl->': wrapIn(nodeType),
      'Ctrl-"': wrapIn(nodeType, {type: "pullquote"})
    };
  }
  
}