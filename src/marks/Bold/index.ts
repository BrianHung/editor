import { Mark } from '../../Mark.js'
import { markInputRule } from '../../utils/markInputRule.js'
import { toggleMark } from "prosemirror-commands"

export const Bold = (options?: Partial<Mark>) => Mark({
  name: "bold",

  // This works around a Google Docs misbehavior where pasted content
  // will be inexplicably wrapped in `<b>` tags with a font-weight normal.
  parseDOM: [{tag: 'strong'}, {tag: 'b', getAttrs: (dom: HTMLElement) => dom.style?.fontWeight !== 'normal' && null}, {style: 'font-weight', getAttrs: (value: string) => /^(bold(er)?|[7-9]\d{2,})$/.test(value) && null}],
  toDOM: () => ['strong', 0],

  inputRules({markType}) {
    return [
      markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, markType),
    ]
  },

  keymap({markType}) {
    return {
      'Mod-b': toggleMark(markType),
      'Mod-B': toggleMark(markType),
    }
  },

  commands({markType}) {
    return {
      bold: () => toggleMark(markType)
    }
  },

  ...options,
})