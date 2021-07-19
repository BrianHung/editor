import { MarkdownSerializerState } from "prosemirror-markdown"
import type { Node as PMNode } from "prosemirror-model";

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
  state.renderContent(node);
}

export const fromMarkdown = () => {
  return { block: "list_item" };
}