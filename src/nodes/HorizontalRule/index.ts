import Node from '../Node'
import { nodeInputRule } from '../../commands'
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import type { EditorState } from "prosemirror-state";

export default class HorizontalRule extends Node {

  get name() {
    return "horizontalrule"
  }

  get schema(): NodeSpec {
    return {
      attrs: {type: {default: null}},
      group: "block",
      parseDOM: [{tag: "hr", getAttrs: (dom: HTMLHRElement) => ({type: dom.dataset.type})}],
      toDOM(node: PMNode) { return ["hr", {"data-type": node.attrs.type}] },
    }
  }

  commands({nodeType}) {
    return (attrs) => (state: EditorState, dispatch) => dispatch(state.tr.replaceSelectionWith(nodeType.create(attrs)))
  }

  inputRules({nodeType}) {
    return [
      // Supports https://www.markdownguide.org/basic-syntax/#horizontal-rules
      nodeInputRule(/^(?:---|\*\*\*|___)$/, nodeType, (match: RegExpMatchArray) => {
        const [type] = match;
        return {type};
      }),
    ];
  } 
}