import Mark from '../Mark';
import markInputRule from '../../commands/markInputRule';
import { toggleMark } from "prosemirror-commands";
export default class Code extends Mark {
    get name() {
        return 'code';
    }
    get schema() {
        return {
            parseDOM: [{ tag: "code" }],
            toDOM() { return ["code", { "spellCheck": "false" }, 0]; },
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule(/(?:`)([^`]+)(?:`)$/, markType),
        ];
    }
    keys({ markType }) {
        return {
            'Mod-e': toggleMark(markType),
            'Mod-E': toggleMark(markType),
        };
    }
}
