import { Node } from "../../Node.js";
import { splitListItem } from "prosemirror-schema-list";
import { sinkListItem, liftListItem } from 'prosemirror-schema-list';
import CustomNodeView from "./toggle-nodeview.js";
import { toggleToggled } from './keymaps.js';
export const ToggleItem = (options) => Node(Object.assign({ name: "toggleitem", attrs: { checked: { default: false } }, content: "paragraph block*", parseDOM: [{
            tag: 'li.toggle-item',
            getAttrs: (dom) => ({ checked: dom.dataset.toggled === 'true' }),
        }], toDOM(node) {
        return [
            'li',
            { class: "toggle-item", 'data-toggled': node.attrs.checked },
            ['input', { class: 'toggle-checkbox', type: 'checkbox' }],
            ['div', { class: 'toggle-content' }, 0],
        ];
    },
    keymap({ nodeType }) {
        return {
            'Ctrl-l': toggleToggled,
            Enter: splitListItem(nodeType),
            Tab: sinkListItem(nodeType),
            'Shift-Tab': liftListItem(nodeType),
        };
    },
    nodeView(props) {
        return new CustomNodeView(props);
    } }, options));
