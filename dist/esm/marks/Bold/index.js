import Mark from '../Mark';
import markInputRule from '../../commands/markInputRule';
import { toggleMark } from "prosemirror-commands";
export default class Bold extends Mark {
    get name() {
        return "bold";
    }
    get schema() {
        return {
            parseDOM: [{ tag: 'strong' }, { tag: 'b', getAttrs: (dom) => { var _a; return ((_a = dom.style) === null || _a === void 0 ? void 0 : _a.fontWeight) !== 'normal' && null; } }, { style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[7-9]\d{2,})$/.test(value) && null }],
            toDOM: () => ['strong', 0],
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, markType),
        ];
    }
    keys({ markType }) {
        return {
            'Mod-b': toggleMark(markType),
            'Mod-B': toggleMark(markType),
        };
    }
}
