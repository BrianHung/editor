import { Mark } from '@brianhung/editor';
import { InlineMathPlugin } from './inline-math-plugin';

export const Math = (options?: Partial<Mark>) =>
	Mark({
		name: 'math',

		inclusive: false,
		toDOM: () => ['math', { spellCheck: 'false' }, 0],
		parseDOM: [{ tag: 'math' }],

		plugins() {
			return [InlineMathPlugin()];
		},

		...options,
	});
