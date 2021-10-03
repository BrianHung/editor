import { MarkdownSerializerState } from 'prosemirror-markdown';
import type { Node as PMNode } from "prosemirror-model";
import Token from "markdown-it/lib/token"

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
  state.write(node.attrs.checked ? "[x] " : "[ ] ");
  state.renderContent(node);
}

export const fromMarkdown = () => {
  return {
    block: "checkbox_item",
    getAttrs: (tok: Token) => ({checked: !!tok.attrGet("checked")}),
  };
}