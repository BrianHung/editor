import { MarkdownSerializerState, ParseSpec } from 'prosemirror-markdown';
import type { Node as PMNode } from 'prosemirror-model';

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
	state.write(node.attrs.markup || '---');
	state.closeBlock(node);
};

export const fromMarkdown: { [token: string]: ParseSpec } = {
	hr: { node: 'horizontalrule' },
};
