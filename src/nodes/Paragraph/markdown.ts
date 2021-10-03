import type { MarkdownSerializerState } from "prosemirror-markdown"
import type { Node as PMNode } from "prosemirror-model";

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
  state.renderInline(node)
  state.closeBlock(node)
}

export const fromMarkdown = () => {
  return { block: "paragraph" }
}