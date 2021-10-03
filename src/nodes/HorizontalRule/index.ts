import { Node } from "../../Node.js"
import { InputRule } from 'prosemirror-inputrules';
import type { Node as PMNode } from "prosemirror-model";
import type { EditorState } from "prosemirror-state";
import { canInsert } from "../../utils/index.js"
// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
export const HorizontalRule = (options?: Partial<Node>) => Node({
  name: "horizontalrule",

  attrs: {type: {default: null}},
  group: "block",
  parseDOM: [{tag: "hr", getAttrs: (dom: HTMLHRElement) => ({type: dom.dataset.type})}],
  toDOM(node: PMNode) { return ["hr", {"data-type": node.attrs.type}] },

  /**
   * Taken from `enable` and `run`.
   * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/menu.js
   */
  commands({nodeType}) {
    return {
      horizontalrule: attrs => (state: EditorState, dispatch) => {
        if (!canInsert(state, nodeType)) return false
        dispatch(state.tr.replaceSelectionWith(nodeType.create(attrs)))
        return true
      }
    }
  },

  inputRules({nodeType}) {
    return [
      // Supports https://www.markdownguide.org/basic-syntax/#horizontal-rules
      new InputRule(/^(---|\*\*\*|___)\n$/, (state, match, start, end) => {
        const tr = state.tr
        tr.replaceWith(start - 1, end, nodeType.create({type: match[1]}))
        return tr
      }),
      // Hack around em-dash inputrule
      new InputRule(/^(—\-|—)\n$/, (state, match, start, end) => {
        const tr = state.tr
        tr.replaceWith(start - 1, end, nodeType.create({type: "---"}))
        return tr
      })
    ];
  },

  ...options
})