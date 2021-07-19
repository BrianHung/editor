import Mark from '../Mark';
import { toggleMark } from "prosemirror-commands";
import type { MarkSpec } from "prosemirror-model";

export default class Superscript extends Mark {

  get name() {
    return 'superscript';
  }

  get schema(): MarkSpec {
    return {
      excludes: "subscript",
      parseDOM: [{tag: "sup"}, {style: 'vertical-align', getAttrs: value => value == 'sup' ? {} : false}],
      toDOM() { return ["sup", 0] },
    };
  }

  keys({markType}) {
    return {
      // Shortcut modeled after Google Docs: https://support.google.com/docs/answer/179738
      'Mod-.': toggleMark(markType),
    };
  }
}