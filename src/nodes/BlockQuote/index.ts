  
import { toggleWrapType } from "../../commands/index.js";
import { wrappingInputRule } from "prosemirror-inputrules";
import type { Node as PMNode } from "prosemirror-model";
import { wrapIn } from "prosemirror-commands";
import { Node } from "../../Node.js"

export const BlockQuote = (options?: Partial<Node>) => Node({
  name: "blockquote",

  attrs: {type: {default: null}},
  content: "block+",
  group: "block",
  parseDOM: [{tag: "blockquote", getAttrs(div: HTMLDivElement) { return {type: div.dataset.type}; }}],
  toDOM(node: PMNode) { return ["blockquote", {...node.attrs.type && {'data-type': node.attrs.type}}, 0]; },
  
  /**
   * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/inputrules.js
   */
  inputRules({nodeType}) {
    return [
      wrappingInputRule(/^> $/, nodeType),
      wrappingInputRule(/^" $/, nodeType, {type: "pullquote"})
    ];
  },

  commands({nodeType}) {
    return {
      "blockquote": attrs => toggleWrapType(nodeType, attrs),
      "pullquote": () => toggleWrapType(nodeType, {type: "pullquote"}),
    }
  },

  keymap({nodeType}) {
    return {
      'Ctrl->': wrapIn(nodeType),
      'Ctrl-"': wrapIn(nodeType, {type: "pullquote"})
    };
  },

  ...options,
})