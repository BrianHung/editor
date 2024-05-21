import { Mark, markInputRule } from '@brianhung/editor';
import { toggleMark } from 'prosemirror-commands';
export * from './markdown';

export const Underline = (options?: Partial<Mark>) =>
	Mark({
		name: 'underline',

		parseDOM: [
			{ tag: 'u' },
			{
				tag: ':not(a)',
				getAttrs: (dom: HTMLElement) =>
					(dom.style?.textDecoration.includes('underline') || dom.style?.textDecorationLine.includes('underline')) &&
					null,
				consuming: false,
			},
		],
		toDOM() {
			return ['u', 0];
		},

		inputRules({ markType }) {
			return [markInputRule(/(?:__)([^_]+)(?:__)$/, markType)];
		},

		keymap({ markType }) {
			return {
				'Mod-u': toggleMark(markType),
				'Mod-U': toggleMark(markType),
			};
		},

		commands({ markType }) {
			return {
				underline: () => toggleMark(markType),
			};
		},

		...options,
	});

export default Underline;
