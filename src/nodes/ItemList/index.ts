import { Node } from "../../Node.js"
import { toggleListType } from "../../commands/index.js"

import type { Node as PMNode } from "prosemirror-model";
import { wrappingInputRule } from 'prosemirror-inputrules'
/**
 * https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
 */
export const ItemList = (options?: Partial<Node>) => Node({
  name: 'itemlist',

  content: 'listitem+',
  group: 'block',
  parseDOM: [{tag: 'ul'}],
  toDOM(node: PMNode) { return ['ul', {class: "item-list"}, 0]},

  commands({nodeType}) {
    return {
      itemlist: () => toggleListType(nodeType)
    }
  },

  keymap({nodeType}) {
    return {
      'Shift-Ctrl-2': toggleListType(nodeType),
    }
  },

  /**
   * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/inputrules.js
   */
  inputRules({nodeType}) {
    return [
      wrappingInputRule(/^([-+*])\s$/, nodeType),
    ]
  },

  ...options,
})