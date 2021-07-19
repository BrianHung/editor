import Extension from './Extension'
import { selectParentNode } from "prosemirror-commands"

/**
 * Define useful keymaps here.
 */
export default class Keymaps extends Extension {

  get name() {
    return 'keymaps'
  }

  keys() {
    return {
      "Mod-c": selectEntireTextblock,
      "Mod-x": selectEntireTextblock,
      "Escape": selectParentNode,
      "Ctrl-Space": clearTextFormatting,
    }
  }
}

import type { EditorState } from "prosemirror-state"
import { TextSelection } from "prosemirror-state"

function selectEntireTextblock(state: EditorState, dispatch) {
  let {selection, tr, doc} = state
  if (!selection.empty) { return false; }
  let $anchor = selection.$anchor; 
  if ($anchor.parent.isTextblock === false) { return false; }
  const nodeStart = $anchor.pos - $anchor.parentOffset, nodeEnd = nodeStart + $anchor.parent.content.size;
  dispatch(tr.setSelection(TextSelection.create(doc, nodeStart, nodeEnd)));
  return true;
}

function clearTextFormatting(state: EditorState, dispatch) {
  let {selection, tr} = state
  if (!(selection instanceof TextSelection) || selection.empty) { return false; }
  dispatch(tr.removeMark(selection.from, selection.to))
  return true
}