import { Node } from '@brianhung/editor';
import type { Node as PMNode } from 'prosemirror-model';
export const Title = (options?: Partial<Node>) =>
	Node({
		name: 'title',
		content: 'inline*',
		parseDOM: [{ tag: 'h1' }],
		toDOM: (node: PMNode) => ['h1', { class: 'title' }, 0],
		...options,
	});
