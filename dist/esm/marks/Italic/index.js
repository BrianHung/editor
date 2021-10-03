import { Mark } from '../../Mark.js';
import { markInputRule } from '../../utils/markInputRule.js';
import { toggleMark } from "prosemirror-commands";
export const Italic = (options) => Mark(Object.assign({ name: 'italic', parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }], toDOM() { return ["em", 0]; },
    inputRules({ markType }) {
        return [
            markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, markType),
        ];
    },
    commands({ markType }) {
        return {
            italic: () => toggleMark(markType)
        };
    },
    keymap({ markType }) {
        return {
            'Mod-i': toggleMark(markType),
            'Mod-I': toggleMark(markType),
        };
    } }, options));
