import { Node } from "../../Node.js";
import { toggleListType } from "../../commands/index.js";
import { wrappingInputRule } from 'prosemirror-inputrules';
export const ItemList = (options) => Node(Object.assign({ name: 'itemlist', content: 'listitem+', group: 'block', parseDOM: [{ tag: 'ul' }], toDOM(node) { return ['ul', { class: "item-list" }, 0]; },
    commands({ nodeType }) {
        return {
            itemlist: () => toggleListType(nodeType)
        };
    },
    keymap({ nodeType }) {
        return {
            'Shift-Ctrl-2': toggleListType(nodeType),
        };
    },
    inputRules({ nodeType }) {
        return [
            wrappingInputRule(/^([-+*])\s$/, nodeType),
        ];
    } }, options));
