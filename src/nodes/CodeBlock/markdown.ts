import { MarkdownSerializerState } from "prosemirror-markdown";
import type { Node as PMNode } from "prosemirror-model";

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
  state.write("```" + node.attrs.lang + "\n");
  state.text(node.textContent, false);
  state.ensureNewLine();
  state.write("```");
  state.closeBlock(node);
}

export const markdownToken = () => {
  return "fence";
}

export const fromMarkdown = () => {
  return {
    block: "code_block",
    getAttrs: tok => ({ language: tok.info }),
  };
}