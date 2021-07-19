import Extension from "./Extension";
import { history, undo, redo } from "prosemirror-history";
/**
 * This is an adaption of the ProseMirror history plugin.
 * Source: tttps://github.com/ProseMirror/prosemirror-history
 */
export default class History extends Extension {
  get name() {
    return "history";
  }
  keys() {
    return {
      "Mod-z": undo,
      "Shift-Mod-z": redo,
    };
  }
  get plugins() {
    return [history()];
  }
}