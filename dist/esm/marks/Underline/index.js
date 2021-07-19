import Mark from '../Mark';
import { toggleMark } from "prosemirror-commands";
import markInputRule from '../../commands/markInputRule';
export default class Underline extends Mark {
    get name() {
        return 'underline';
    }
    get schema() {
        return {
            parseDOM: [{ tag: 'u' }, { tag: ':not(a)', getAttrs: (dom) => { var _a, _b; return (((_a = dom.style) === null || _a === void 0 ? void 0 : _a.textDecoration.includes("underline")) || ((_b = dom.style) === null || _b === void 0 ? void 0 : _b.textDecorationLine.includes("underline"))) && null; }, consuming: false }],
            toDOM() { return ['u', 0]; },
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule(/(?:__)([^_]+)(?:__)$/, markType)
        ];
    }
    keys({ markType }) {
        return {
            'Mod-u': toggleMark(markType),
            'Mod-U': toggleMark(markType),
        };
    }
}
