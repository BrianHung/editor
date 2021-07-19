import Extension from "./Extension";
import { FocusMode as FocusModePlugin, toggleFocusMode } from "../plugins/FocusMode"

/**
 * Adds ability to toggle the class 'ProseMirror-focusmode' onto the parent ProseMirror DOM node.
 * Note: This extension requires the Placeholder extension to be used in conjuction.
 */
export default class FocusMode extends Extension {

  get name() {
    return 'FocusMode';
  }

  keys() {
    return {
      "Shift-Ctrl-f": toggleFocusMode
    };
  }

  commands() {
    return () => toggleFocusMode
  }

  get plugins() {
    return [
      FocusModePlugin()
    ];
  }
}