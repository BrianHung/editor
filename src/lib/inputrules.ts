/**
 * This is a modification of the prosemirror-inputrules plugin to trigger on 'enter' key.
 * The logic for that is contained within handleKeyDown.
 * Source: https://github.com/ProseMirror/prosemirror-inputrules/blob/master/src/inputrules.js
 */
import { InputRule } from "prosemirror-inputrules"
import {Plugin, PluginKey, TextSelection} from "prosemirror-state"
import { EditorView } from "prosemirror-view"

const MAX_MATCH = 500
const pluginKey = new PluginKey("InputRules");

// :: (config: {rules: [InputRule]}) → Plugin
// Create an input rules plugin. When enabled, it will cause text
// input that matches any of the given rules to trigger the rule's
// action.
export function inputRules({rules}: {rules: InputRule[]}) {
  let plugin = new Plugin({
    state: {
      init() { return null },
      apply(tr, prev) {
        let stored = tr.getMeta(this)
        if (stored) return stored
        return tr.selectionSet || tr.docChanged ? null : prev
      }
    },
    props: {
      handleTextInput(view, from, to, text) {
        return run(view, from, to, text, rules, plugin)
      },
      handleDOMEvents: {
        // https://discuss.prosemirror.net/t/settimeout-in-inputrule-compositionend/3238/2
        compositionend: (view) => {
          setTimeout(() => {
            let {$cursor} = view.state.selection as TextSelection
            if ($cursor) { return run(view, $cursor.pos, $cursor.pos, "", rules, plugin); }
          })
          return false;
        }
      },
      handleKeyDown(view, event) {
        if (event.key !== "Enter") { return false; }
        let {$cursor} = view.state.selection as TextSelection
        if ($cursor) { return run(view, $cursor.pos, $cursor.pos, "\n", rules, plugin); }
        return false;
      }
    },
    // @ts-ignore
    isInputRules: true,
    key: pluginKey,
  })
  return plugin
}

function run(view: EditorView, from: number, to: number, text: string, rules: InputRule[], plugin: Plugin) {
  if (view.composing) return false
  let state = view.state, $from = state.doc.resolve(from)
  if ($from.parent.type.spec.code) return false
  let textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - MAX_MATCH), $from.parentOffset, null, "\ufffc") + text
  for (let i = 0; i < rules.length; i++) {
    // @ts-ignore
    let match = rules[i].match.exec(textBefore) 
    // @ts-ignore
    let tr = match && rules[i].handler(state, match, from - (match[0].length - text.length), to)
    if (!tr) continue
    view.dispatch(tr.setMeta(plugin, {transform: tr, from, to, text}))
    return true
  }
  return false
}