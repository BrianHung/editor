import Mark from '../Mark';
import { toggleMark } from "prosemirror-commands";
import type { MarkSpec } from "prosemirror-model";
import markInputRule from '../../commands/markInputRule';

export default class Underline extends Mark {

  get name() {
    return 'underline';
  }

  get schema(): MarkSpec {
    return {
      parseDOM: [{tag: 'u'}, {tag: ':not(a)', getAttrs: (dom: HTMLElement) => (dom.style?.textDecoration.includes("underline") || dom.style?.textDecorationLine.includes("underline")) && null, consuming: false}],
      toDOM() { return ['u', 0] },
    }
  }

  inputRules({ markType }) {
    return [
      markInputRule(/(?:__)([^_]+)(?:__)$/, markType)
    ];
  }

  keys({ markType }) {
    return {
      'Mod-u': toggleMark(markType),
      'Mod-U': toggleMark(markType),
    };
  }
}
