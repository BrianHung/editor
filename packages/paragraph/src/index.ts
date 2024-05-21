import { Node } from '@brianhung/editor';
import { setBlockType } from 'prosemirror-commands';
export * from './markdown';

export const Paragraph = (options?: Partial<Node>) =>
	Node({
		name: 'paragraph',

		content: 'inline*',
		group: 'block',
		parseDOM: [{ tag: 'p' }],
		toDOM(node) {
			return ['p', node.attrs, 0];
		},

		keymap({ nodeType }) {
			return {
				'Mod-Alt-0': setBlockType(nodeType),
			};
		},

		commands({ nodeType }) {
			return {
				paragraph: () => setBlockType(nodeType),
			};
		},

		...options,
	});

export default Paragraph;
