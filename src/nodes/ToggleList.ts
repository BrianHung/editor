import Node from './Node'
import { toggleList } from "../commands"
import type { NodeSpec } from "prosemirror-model";
import { wrappingInputRule } from 'prosemirror-inputrules'

export default class ToggleList extends Node {

  get name() {
    return 'togglelist'
  }

  get schema(): NodeSpec {
    return {
      group: 'block',
      content: 'toggleitem+',
      toDOM: () => ['ul', {class: 'toggle-list'}, 0],
      parseDOM: [{tag: 'ul.toggle-list'}],
    }
  }

  commands({nodeType}) {
    return () => toggleList(nodeType)
  }

  inputRules({nodeType}) {
    return [
      wrappingInputRule(/^>>\s$/, nodeType),
    ]
  }
}