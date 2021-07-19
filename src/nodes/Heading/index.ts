import Node from "../Node";
import { toggleBlockType } from '../../commands'
import { textblockTypeInputRule } from "prosemirror-inputrules"
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import { setBlockType } from "prosemirror-commands";

export default class Heading extends Node {

  get name() {
    return 'heading'
  }

  get schema(): NodeSpec {
    return {
      attrs: {level: {default: 1}},
      content: "inline*",
      group: "block",
      defining: true,
      parseDOM: [
        {tag: "h1", attrs: {level: 1}},
        {tag: "h2", attrs: {level: 2}},
        {tag: "h3", attrs: {level: 3}},
        {tag: "h4", attrs: {level: 4}},
        {tag: "h5", attrs: {level: 5}},
        {tag: "h6", attrs: {level: 6}}
      ],
      toDOM(node: PMNode) { return ["h" + node.attrs.level, 0] },
    }
  }

  commands({nodeType, schema}) {
    return attrs => toggleBlockType(nodeType, schema.nodes.paragraph, attrs)
  }

  inputRules({nodeType}) {
    return [
      textblockTypeInputRule(new RegExp(`^(#{1,6})\\s$`), nodeType, match => ({level: match[1].length}))
    ];
  }

  keys({nodeType}) {
    return {
      "Mod-Alt-1": setBlockType(nodeType, {level: 1}),
      "Mod-Alt-2": setBlockType(nodeType, {level: 2}),
      "Mod-Alt-3": setBlockType(nodeType, {level: 3}),
      "Mod-Alt-4": setBlockType(nodeType, {level: 4}),
      "Mod-Alt-5": setBlockType(nodeType, {level: 5}),
      "Mod-Alt-6": setBlockType(nodeType, {level: 6}),
    };
  }
}