import type { MarkdownSerializerState, ParseSpec } from 'prosemirror-markdown';
import type { Node as PMNode } from 'prosemirror-model';

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
	state.renderInline(node);
	state.closeBlock(node);
};

export const fromMarkdown: { [token: string]: ParseSpec } = {
	paragraph: { block: 'paragraph' },
};
