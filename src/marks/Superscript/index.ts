import { Mark } from '../../Mark.js'
import { toggleMark } from "prosemirror-commands"

export const Superscript = (options?: Partial<Mark>) => Mark({
  name: 'superscript',

  excludes: 'subscript',
  parseDOM: [{tag: "sup"}, {style: 'vertical-align', getAttrs: value => value == 'sup' ? {} : false}],
  toDOM() { return ["sup", 0] },

  commands({markType}) {
    return {
      superscript: () => toggleMark(markType)
    }
  },

  keymap({markType}) {
    return {
      // Shortcut based on Google Docs (https://support.google.com/docs/answer/179738).
      'Mod-.': toggleMark(markType),
    };
  },

  ...options,
})