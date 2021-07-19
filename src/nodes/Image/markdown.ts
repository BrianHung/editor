import { MarkdownSerializerState } from "prosemirror-markdown"
import type { Node as PMNode } from "prosemirror-model";

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
  let alt = state.esc(node.attrs.alt || "");
  let src = state.esc(node.attrs.src) + (node.attrs.title ? " " + state.quote(node.attrs.title) : "");
  state.write(`![${alt}](${src})`);
}

export const fromMarkdown = () => {
  return {
    node: "image",
    getAttrs: tok => ({
      src: tok.attrGet("src"),
      title: tok.attrGet("title") || null,
      alt: tok.children[0] && tok.children[0].content || null
    }),
  };
}