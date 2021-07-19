import Mark from '../Mark';
import markInputRule from '../../commands/markInputRule';
import { toggleMark } from "prosemirror-commands";
export default class Strikethrough extends Mark {
    get name() {
        return 'strikethrough';
    }
    get schema() {
        return {
            parseDOM: [{ tag: 's' }, { tag: 'del' }, { tag: 'strike' }, { style: 'text-decoration', getAttrs: (value) => value.includes('line-through') && null },],
            toDOM() { return ['s', 0]; },
        };
    }
    keys({ markType }) {
        return {
            'Mod-d': toggleMark(markType),
            'Mod-D': toggleMark(markType),
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule(/(?:~~)([^~\s]+(?:\s+[^~\s]+)*)(?:~~)$/, markType),
        ];
    }
}
