import Node from '../Node'
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import { splitListItem } from "prosemirror-schema-list"
import { sinkListItem, liftListItem } from 'prosemirror-schema-list'
import CustomNodeView from "./toggle-nodeview"

import { toggleToggled } from './keymaps';

export default class ToggleItem extends Node {

  get name() {
    return "toggleitem"
  }

  get schema(): NodeSpec {
    return {
      attrs: {checked: {default: false}},
      content: "paragraph block*",
      draggable: true,
      parseDOM: [{
        tag: 'li.toggle-item',
        getAttrs: (dom: HTMLLIElement) => ({checked: dom.dataset.toggled === 'true'}),
      }],
      toDOM(node: PMNode) {
        return [
          'li', 
          {class: "toggle-item", 'data-toggled': node.attrs.checked}, 
          ['input', {class: 'toggle-checkbox', type: 'checkbox'}], 
          ['div', {class: 'toggle-content'}, 0],
        ]
      },
    }
  }

  keys({nodeType}) {
    return {
      'Ctrl-l': toggleToggled,
      Enter: splitListItem(nodeType),
      Tab: sinkListItem(nodeType),
      'Shift-Tab': liftListItem(nodeType),
    };
  }
  
  customNodeView(props) {
    return new CustomNodeView(props);
  }
}