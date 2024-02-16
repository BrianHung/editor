import { Node } from '@brianhung/editor';
import { onBackspaceFigcaption, onEnterFigcaption } from './keymaps.js';

export const Figcaption = (options?: Partial<Node>) =>
	Node({
		name: 'figcaption',
		content: 'inline*',
		group: 'figure',
		parseDOM: [{ tag: 'figcaption' }],
		toDOM() {
			return ['figcaption', 0];
		},
		keymap({ nodeType }) {
			return {
				Enter: onEnterFigcaption,
				Backspace: onBackspaceFigcaption,
			};
		},
		...options,
	});
