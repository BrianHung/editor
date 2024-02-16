import { Node } from '@brianhung/editor';
import type { Node as PMNode } from 'prosemirror-model';

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
 */
export const Source = (options?: Partial<Node>) =>
	Node({
		name: 'source',

		attrs: {
			src: { default: undefined },
			media: { default: undefined },
			type: { default: undefined },
		},
		inline: false,
		group: 'block',
		parseDOM: [{ tag: 'source' }],
		toDOM(node: PMNode) {
			return ['source', { ...node.attrs }];
		},

		...options,
	});
