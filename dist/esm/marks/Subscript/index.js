import Mark from '../Mark';
import { toggleMark } from "prosemirror-commands";
export default class Subscript extends Mark {
    get name() {
        return 'subscript';
    }
    get schema() {
        return {
            excludes: "superscript",
            parseDOM: [{ tag: "sub" }, { style: 'vertical-align', getAttrs: value => value == 'sub' ? {} : false }],
            toDOM() { return ["sub", 0]; },
        };
    }
    keys({ markType }) {
        return {
            'Mod-,': toggleMark(markType),
        };
    }
}
