import { Mark } from '../../Mark.js';
import { markInputRule } from '../../utils/markInputRule.js';
import { toggleMark } from "prosemirror-commands";
export const Highlight = (options) => Mark(Object.assign({ name: 'highlight', parseDOM: [{ tag: "mark" }], toDOM() { return ["mark", 0]; },
    inputRules({ markType }) {
        return [
            markInputRule(/(?:==)([^=\s]+(?:\s+[^=\s]+)*)(?:==)$/, markType),
        ];
    },
    commands({ markType }) {
        return {
            highlight: () => toggleMark(markType)
        };
    },
    keymap({ markType }) {
        return {
            'Mod-h': toggleMark(markType),
            'Mod-H': toggleMark(markType),
        };
    } }, options));
