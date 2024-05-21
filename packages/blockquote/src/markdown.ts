import { MarkdownSerializerState, ParseSpec } from 'prosemirror-markdown';
import type { Node as PMNode } from 'prosemirror-model';

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
	state.wrapBlock('> ', null, node, () => state.renderContent(node));
};

export const fromMarkdown: { [token: string]: ParseSpec } = {
	blockquote: { block: 'blockquote' },
};
