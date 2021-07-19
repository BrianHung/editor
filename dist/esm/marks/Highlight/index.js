import Mark from '../Mark';
import markInputRule from '../../commands/markInputRule';
import { toggleMark } from "prosemirror-commands";
export default class Highlight extends Mark {
    get name() {
        return 'highlight';
    }
    get schema() {
        return {
            parseDOM: [{ tag: "mark" }],
            toDOM() { return ["mark", 0]; },
        };
    }
    keys({ markType }) {
        return {
            'Mod-h': toggleMark(markType),
            'Mod-H': toggleMark(markType),
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule(/(?:==)([^=\s]+(?:\s+[^=\s]+)*)(?:==)$/, markType),
        ];
    }
}
