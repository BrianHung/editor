import Node from '../Node';
import { splitListItem } from "prosemirror-schema-list";
import { sinkListItem, liftListItem } from 'prosemirror-schema-list';
import CustomNodeView from "./toggle-nodeview";
import { toggleToggled } from './keymaps';
export default class ToggleItem extends Node {
    get name() {
        return "toggleitem";
    }
    get schema() {
        return {
            attrs: { checked: { default: false } },
            content: "paragraph block*",
            draggable: true,
            parseDOM: [{
                    tag: 'li.toggle-item',
                    getAttrs: (dom) => ({ checked: dom.dataset.toggled === 'true' }),
                }],
            toDOM(node) {
                return [
                    'li',
                    { class: "toggle-item", 'data-toggled': node.attrs.checked },
                    ['input', { class: 'toggle-checkbox', type: 'checkbox' }],
                    ['div', { class: 'toggle-content' }, 0],
                ];
            },
        };
    }
    keys({ nodeType }) {
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
