import Mark from '../Mark';
import { toggleMark } from "prosemirror-commands";
import type { MarkSpec } from "prosemirror-model";

export default class Subscript extends Mark {

  get name() {
    return 'subscript';
  }

  get schema(): MarkSpec {
    return {
      excludes: "superscript",
      parseDOM: [{tag: "sub"}, {style: 'vertical-align', getAttrs: value => value == 'sub' ? {} : false}],
      toDOM() { return ["sub", 0] },
    };
  }

  keys({markType}) {
    return {
      // Shortcut modeled after Google Docs: https://support.google.com/docs/answer/179738
      'Mod-,': toggleMark(markType),
    };
  }
}
