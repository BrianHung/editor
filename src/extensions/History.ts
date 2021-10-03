import { Extension } from "../Extension.js"
import { history, undo, redo } from "prosemirror-history"

/**
 * https://github.com/ProseMirror/prosemirror-history
 */
export const History = (options?) => Extension({
  name: 'history',

  keymap() {
    return {
      "Mod-z": undo,
      "Mod-Z": undo,
      "Mod-y": redo,
      "Mod-Y": redo,
      "Shift-Mod-z": redo,
      "Shift-Mod-Z": redo,
    }
  },

  plugins() {
    return [history()]
  },
  
  ...options,
})