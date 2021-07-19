import { Plugin, PluginKey, EditorState, Transaction } from 'prosemirror-state'
import { Decoration, DecorationSet, EditorView } from "prosemirror-view"
import { Node } from 'prosemirror-model';

// Expose plugin key to allow external commands. 
export const FindReplaceKey = new PluginKey("FindReplace");

export default function FindReplace() {
  return new Plugin({
    state: {
      init(configs, state) {
        return new FindReplaceState(state);
      },
      apply(tr, pluginState, prevState, nextState) {
        return pluginState.applyTransaction(tr);
      }
    },
    props: {
      decorations(state) {
        return this.getState(state).decorations;
      },
    },
    key: FindReplaceKey,
  })
}

class FindReplaceState {

  constructor (state: EditorState) {
  }
}