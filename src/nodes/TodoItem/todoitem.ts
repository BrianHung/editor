import { Node } from "../../Node.js"
import type { Node as PMNode } from "prosemirror-model";
import { splitListItem } from "prosemirror-schema-list"
import { sinkListItem, liftListItem } from 'prosemirror-schema-list'
import { wrappingInputRule } from 'prosemirror-inputrules';
import { toggleChecked } from './keymaps.js';

export const TodoItem = (options?: Partial<Node>) => Node({
  name: 'todoitem',

  attrs: {checked: {default: false}},
  content: "paragraph block*",
  parseDOM: [{tag: 'li.todo-item', getAttrs: (dom: HTMLLIElement) => ({checked: dom.dataset.checked === 'true'}), priority: 51}],
  toDOM(node: PMNode) {
    return [
      'li', 
      {class: 'todo-item', 'data-checked': node.attrs.checked}, 
      ['input', {class: 'todo-checkbox', type: 'checkbox', disabled: '', ...node.attrs.checked && {checked: ''}}], 
      ['div', {class: 'todo-content'}, 0],
    ]
  },

  inputRules({nodeType}) {
    return [
      wrappingInputRule(/^\[(x| )?\]\s$/, nodeType, ([match, checked]: RegExpExecArray) => ({checked: checked === "x"})),
    ]
  },

  keymap({nodeType}) {
    return {
      'Ctrl-d': toggleChecked,
      Enter: splitListItem(nodeType),
      Tab: sinkListItem(nodeType),
      'Shift-Tab': liftListItem(nodeType),
      "Mod-[": liftListItem(nodeType),
      "Mod-]": sinkListItem(nodeType),
    };
  },

  ...options,
})