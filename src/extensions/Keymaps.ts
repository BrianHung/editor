import { Extension } from '../Extension.js'
import { selectParentNode, lift, joinUp, joinDown } from "prosemirror-commands"
import { selectTextblock, removeAllMarks } from "../commands/index.js"

/**
 * Define useful keymaps here.
 * Default keymaps lifted from:
 * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/keymap.js
 */
export const Keymaps = (options?) => Extension({
  name: 'keymaps',

  keymap() {
    return {
      "Alt-ArrowUp": joinUp,
      "Alt-ArrowDown": joinDown,
      "Mod-[": lift,
      "Escape": selectParentNode,
      "Mod-c": selectTextblock,
      "Mod-x": selectTextblock,
      "Ctrl-Space": removeAllMarks,
    }
  },

  ...options,
})