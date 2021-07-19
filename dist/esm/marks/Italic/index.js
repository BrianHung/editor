import Mark from '../Mark';
import markInputRule from '../../commands/markInputRule';
import { toggleMark } from "prosemirror-commands";
export default class Italic extends Mark {
    get name() {
        return 'italic';
    }
    get schema() {
        return {
            parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
            toDOM() { return ["em", 0]; },
        };
    }
    keys({ markType }) {
        return {
            'Mod-i': toggleMark(markType),
            'Mod-I': toggleMark(markType),
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, markType),
        ];
    }
}
