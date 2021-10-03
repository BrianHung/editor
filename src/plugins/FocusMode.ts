import type { EditorState, Transaction } from 'prosemirror-state'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { Command } from 'prosemirror-commands'

export const FocusModeKey = new PluginKey('FocusMode')

export function FocusMode(options = {initState: false}) {
  return new Plugin({
    key: FocusModeKey,
    props: {
      attributes(state) {
        return this.getState(state) ? {class: "ProseMirror-focusmode"} : null
      }
    },
    state: {
      init: (config: Object, state: EditorState): boolean => options.initState,
      apply(tr: Transaction, prevState: boolean): boolean {
        let focus = tr.getMeta(FocusModeKey)
        if (focus === undefined) return prevState
        return typeof focus === 'boolean' ? focus : !prevState
      }
    },
  })
}

export default FocusMode

export function toggleFocusMode(focus: null | boolean = null) {
  return (state: EditorState, dispatch) => {
    dispatch(state.tr.setMeta(FocusModeKey, focus))
    return true
  }
}