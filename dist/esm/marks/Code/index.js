import { Mark } from '../../Mark.js';
import { markInputRule } from '../../utils/markInputRule.js';
import { toggleMark } from "prosemirror-commands";
export const Code = (options) => Mark(Object.assign({ name: "code", parseDOM: [{ tag: "code" }], toDOM() { return ["code", { "spellCheck": "false" }, 0]; },
    inputRules({ markType }) {
        return [
            markInputRule(/(?:`)([^`]+)(?:`)$/, markType),
        ];
    },
    keymap({ markType }) {
        return {
            'Mod-e': toggleMark(markType),
            'Mod-E': toggleMark(markType),
        };
    },
    commands({ markType }) {
        return {
            code: () => toggleMark(markType)
        };
    } }, options));
