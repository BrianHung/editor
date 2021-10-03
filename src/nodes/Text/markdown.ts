import { MarkdownSerializerState } from "prosemirror-markdown"
import { Node as PMNode } from "prosemirror-model"

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
  state.text(node.text)
}