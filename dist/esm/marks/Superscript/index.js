import Mark from '../Mark';
import { toggleMark } from "prosemirror-commands";
export default class Superscript extends Mark {
    get name() {
        return 'superscript';
    }
    get schema() {
        return {
            excludes: "subscript",
            parseDOM: [{ tag: "sup" }, { style: 'vertical-align', getAttrs: value => value == 'sup' ? {} : false }],
            toDOM() { return ["sup", 0]; },
        };
    }
    keys({ markType }) {
        return {
            'Mod-.': toggleMark(markType),
        };
    }
}
