import Node, { CustomNodeViewProps } from '../Node'
import { lineIndent, lineUndent, newlineIndent, deleteMathBlock } from "./keymaps"
import { toggleBlockType } from '../../commands'
import { textblockTypeInputRule } from 'prosemirror-inputrules'
import { setBlockType } from 'prosemirror-commands'
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import MathBlockNodeView from "./mathblock-nodeview";
import { Fragment, Schema } from "prosemirror-model"

export default class MathBlock extends Node {

  get name() {
    return "mathblock";
  }

  get schema(): NodeSpec {
    return {
      attrs: {lang: {default: "stex"}, lineNumbers: {default: false}},
      content: "text*",
      marks: "",
      group: "block",
      code: true,
      isolating: true,
      parseDOM: [{
        tag: "pre.mathblock", 
        preserveWhitespace: "full"
      }, {
        // Matches mathblocks from Wikipedia+Mediawiki.
        tag: "dl",
        getAttrs(dom: HTMLDListElement) {
          if (dom.childElementCount !== 1 || (dom.firstChild as Element).tagName !== "DD" || (dom.firstChild as Element).childElementCount !== 1 || !(dom.firstChild.firstChild as Element).classList.contains("mwe-math-element")) return false;
          return null;
        },
        getContent(dom: HTMLDListElement, schema) {
          let content = dom.querySelector("math").getAttribute("alttext") || dom.querySelector("img.mwe-math-fallback-image-inline").getAttribute("alt");
          return Fragment.from(schema.text(content)) as Fragment<typeof schema>;
        }
      }, {
        tag: "div.mwe-math-element",
        getContent(dom: HTMLDListElement, schema) {
          let content = dom.querySelector("math").getAttribute("alttext") || dom.querySelector("img.mwe-math-fallback-image-display").getAttribute("alt");
          return Fragment.from(schema.text(content)) as Fragment<typeof schema>;
        }
      }],
      toDOM: (node: PMNode) => ["pre", {class: "mathblock"}, ["code", {spellcheck: "false"}, 0]],
    };
  }

  commands({nodeType, schema}) {
    return () => toggleBlockType(nodeType, schema.nodes.paragraph)
  }

  keys({nodeType}) {
    return {
      "Tab": lineIndent,
      "Shift-Tab": lineUndent,
      "Enter": newlineIndent,
      "Backspace": deleteMathBlock
    }
  }

  inputRules({nodeType}) {
    return [
      textblockTypeInputRule(/^\$\$\$$/, nodeType),
    ];
  }

  customNodeView(props: CustomNodeViewProps) {
    return new MathBlockNodeView(props);
  }
}