import { Node } from "../../Node.js";
import { wrappingInputRule } from 'prosemirror-inputrules';
import { toggleListType } from "../../commands/index.js";
export const EnumList = (options) => Node(Object.assign({ name: 'enumlist', attrs: { start: { default: 1 } }, content: 'listitem+', group: 'block', parseDOM: [{ tag: "ol", getAttrs(dom) { return { start: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1 }; } }], toDOM(node) { return ['ol', { class: "enum-list", start: node.attrs.start }, 0]; },
    commands({ nodeType }) {
        return {
            enumlist: () => toggleListType(nodeType)
        };
    },
    keymap({ nodeType }) {
        return {
            'Shift-Ctrl-1': toggleListType(nodeType),
        };
    },
    inputRules({ nodeType }) {
        return [
            wrappingInputRule(/^(\d+)\.\s$/, nodeType, ([match, start]) => ({ start: +start }), ([match, start], node) => node.childCount + node.attrs.start === +start),
        ];
    } }, options));
