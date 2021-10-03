import { Mark } from '../../Mark.js';
import { toggleMark } from "prosemirror-commands";
export const Subscript = (options) => Mark(Object.assign({ name: 'subscript', excludes: 'superscript', parseDOM: [{ tag: "sub" }, { style: 'vertical-align', getAttrs: value => value == 'sub' ? {} : false }], toDOM() { return ["sub", 0]; },
    commands({ markType }) {
        return {
            subscript: () => toggleMark(markType)
        };
    },
    keymap({ markType }) {
        return {
            'Mod-,': toggleMark(markType),
        };
    } }, options));
