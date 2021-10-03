import { Node } from "../../Node.js"
import { toggleListType } from "../../commands/index.js"

export const TodoList = (options?: Partial<Node>) => Node({
  name: 'todolist',

  group: 'block',
  content: 'todoitem+',
  parseDOM: [{tag: 'ul.todo-list', priority: 51}],
  toDOM() { return ['ul', {class: 'todo-list'}, 0] },

  commands({nodeType, schema}) {
    return {
      todolist: () => toggleListType(nodeType)
    }
  },

  keymap({nodeType}) {
    return {
      'Shift-Ctrl-3': toggleListType(nodeType),
    }
  },

  ...options,
})