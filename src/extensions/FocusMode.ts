import { Extension, ExtensionSpec } from "../Extension.js";
import { FocusMode as FocusModePlugin, toggleFocusMode } from "../plugins/FocusMode.js"

/**
 * Adds ability to toggle the class 'ProseMirror-focusmode' onto the parent ProseMirror DOM node.
 * Note: This extension requires the Placeholder extension to be used in conjuction.
 */
export const FocusMode = (options?: ExtensionSpec) => Extension({
  name: 'focusMode',

  plugins() {
    return [
      FocusModePlugin()
    ]
  },

  commands() {
    return {
      focusMode: focus => toggleFocusMode(focus)
    }
  },

  keymap() {
    return {
      "Shift-Ctrl-f": toggleFocusMode()
    }
  },

  ...options,
})