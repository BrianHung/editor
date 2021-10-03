import { Mark } from '../../Mark.js';
import { markInputRule } from '../../utils/markInputRule.js';
import { toggleMark } from "prosemirror-commands";
export const Bold = (options) => Mark(Object.assign({ name: "bold", parseDOM: [{ tag: 'strong' }, { tag: 'b', getAttrs: (dom) => { var _a; return ((_a = dom.style) === null || _a === void 0 ? void 0 : _a.fontWeight) !== 'normal' && null; } }, { style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[7-9]\d{2,})$/.test(value) && null }], toDOM: () => ['strong', 0], inputRules({ markType }) {
        return [
            markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, markType),
        ];
    },
    keymap({ markType }) {
        return {
            'Mod-b': toggleMark(markType),
            'Mod-B': toggleMark(markType),
        };
    },
    commands({ markType }) {
        return {
            bold: () => toggleMark(markType)
        };
    } }, options));
