import { Mark } from '../../Mark.js';
import { toggleMark } from "prosemirror-commands";
export const Superscript = (options) => Mark(Object.assign({ name: 'superscript', excludes: 'subscript', parseDOM: [{ tag: "sup" }, { style: 'vertical-align', getAttrs: value => value == 'sup' ? {} : false }], toDOM() { return ["sup", 0]; },
    commands({ markType }) {
        return {
            superscript: () => toggleMark(markType)
        };
    },
    keymap({ markType }) {
        return {
            'Mod-.': toggleMark(markType),
        };
    } }, options));
