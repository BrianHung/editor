import Mark from '../Mark';
import markInputRule from '../../commands/markInputRule';
import { toggleMark } from "prosemirror-commands";
import type { MarkSpec } from "prosemirror-model";

export default class Highlight extends Mark {

  get name() {
    return 'highlight'
  }

  get schema(): MarkSpec {
    return {
      parseDOM: [{tag: "mark"}],
      toDOM() { return ["mark", 0] },
    }
  }

  keys({markType}) {
    return {
      'Mod-h': toggleMark(markType),
      'Mod-H': toggleMark(markType),
    }
  }

  inputRules({markType}) {
    return [
      markInputRule(/(?:==)([^=\s]+(?:\s+[^=\s]+)*)(?:==)$/, markType),
    ]
  }
}