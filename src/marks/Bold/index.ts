import Mark from '../Mark';
import markInputRule from '../../commands/markInputRule';
import { toggleMark } from "prosemirror-commands";
import type { MarkSpec } from "prosemirror-model";

export default class Bold extends Mark {

  get name() {
    return "bold"
  }

  get schema(): MarkSpec {
    return {
      // This works around a Google Docs misbehavior where pasted content
      // will be inexplicably wrapped in `<b>` tags with a font-weight normal.
      parseDOM: [{tag: 'strong'}, {tag: 'b', getAttrs: (dom: HTMLElement) => dom.style?.fontWeight !== 'normal' && null}, {style: 'font-weight', getAttrs: (value: string) => /^(bold(er)?|[7-9]\d{2,})$/.test(value) && null}],
      toDOM: () => ['strong', 0],
    }
  }

  inputRules({markType}) {
    return [
      markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, markType),
    ]
  }

  keys({markType}) {
    return {
      'Mod-b': toggleMark(markType),
      'Mod-B': toggleMark(markType),
    }
  }
}