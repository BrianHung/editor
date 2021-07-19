import Node from '../Node'
import { toggleList } from "../../commands"
import type { NodeSpec } from "prosemirror-model";

export default class TodoList extends Node {

  get name() {
    return 'todolist'
  }

  get schema(): NodeSpec {
    return {
      group: 'block',
      content: 'todoitem+',
      parseDOM: [{tag: 'ul.todo-list'}],
      toDOM() { return ['ul', {class: 'todo-list'}, 0] },
    }
  }

  commands({nodeType, schema}) {
    return () => toggleList(nodeType)
  }

  keys({nodeType}) {
    return {
      'Shift-Ctrl-3': toggleList(nodeType),
    }
  }
}