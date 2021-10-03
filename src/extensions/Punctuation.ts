import { Extension } from '../Extension.js'
import { InputRule } from "prosemirror-inputrules"
import { emDash, ellipsis } from 'prosemirror-inputrules';

export const leftArrow = new InputRule(/<-$/, "←")
export const rightArrow = new InputRule(/->$/, "→")
export const longLeftArrow = new InputRule(/←-$/, "⟵")
export const longRightArrow = new InputRule(/—>$/, "⟶")

export const Punctuation = (options?) => Extension({
  name: 'punctuation',

  inputRules() {
    return [
      emDash,
      ellipsis,
      leftArrow,
      rightArrow,
      longLeftArrow,
      longRightArrow
    ];
  },

  ...options,
})