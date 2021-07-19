import Node from '../Node'
import { toggleList } from "../../commands"

import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import { wrappingInputRule, InputRule } from 'prosemirror-inputrules'
import { listInputRule } from "../../commands";
import { MarkdownSerializerState } from "prosemirror-markdown"

export default class ItemList extends Node {

  get name() {
    return 'itemlist'
  }

  get schema(): NodeSpec {
    return {
      content: 'listitem+',
      group: 'block',
      parseDOM: [{ tag: 'ul' }],
      toDOM(node: PMNode) { return ['ul', {class: "item-list"}, 0]},
      draggable: true,
    }
  }

  commands({nodeType}) {
    return () => toggleList(nodeType)
  }

  keys({nodeType}) {
    return {
      'Shift-Ctrl-2': toggleList(nodeType),
    }
  }

  inputRules({nodeType}) {
    return [
      listInputRule(/^([-+*])\s$/, nodeType),
      wrappingInputRule(/^([-+*])\s$/, nodeType),
    ]
  }
}