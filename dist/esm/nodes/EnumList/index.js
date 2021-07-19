import Node from '../Node';
import { wrappingInputRule } from 'prosemirror-inputrules';
import { toggleList } from "../../commands";
export default class EnumList extends Node {
    get name() {
        return 'enumlist';
    }
    get schema() {
        return {
            attrs: { start: { default: 1 } },
            content: 'listitem+',
            group: 'block',
            parseDOM: [{ tag: "ol", getAttrs(dom) { return { start: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1 }; } }],
            toDOM(node) { return ['ol', { class: "enum-list", start: node.attrs.start }, 0]; },
        };
    }
    commands({ nodeType }) {
        return () => toggleList(nodeType);
    }
    keys({ nodeType }) {
        return {
            'Shift-Ctrl-1': toggleList(nodeType),
        };
    }
    inputRules({ nodeType }) {
        return [
            wrappingInputRule(/^(\d+)\.\s$/, nodeType, match => ({ start: +match[1] }), (match, node) => node.childCount + node.attrs.start === +match[1]),
        ];
    }
}
