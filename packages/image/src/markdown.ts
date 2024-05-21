import { MarkdownSerializerState, ParseSpec } from 'prosemirror-markdown';
import type { Node as PMNode } from 'prosemirror-model';

export const toMarkdown = (state: MarkdownSerializerState, node: PMNode) => {
	state.write(
		'![' +
			state.esc(node.attrs.alt || '') +
			'](' +
			node.attrs.src.replace(/[\(\)]/g, '\\$&') +
			(node.attrs.title ? ' "' + node.attrs.title.replace(/"/g, '\\"') + '"' : '') +
			')'
	);
};

export const fromMarkdown: { [token: string]: ParseSpec } = {
	image: {
		node: 'image',
		getAttrs: tok => ({
			src: tok.attrGet('src'),
			title: tok.attrGet('title') || null,
			alt: (tok.children![0] && tok.children![0].content) || null,
		}),
	},
};
