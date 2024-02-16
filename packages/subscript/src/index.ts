import { Mark } from '@brianhung/editor';
import { toggleMark } from 'prosemirror-commands';

export const Subscript = (options?: Partial<Mark>) =>
	Mark({
		name: 'subscript',

		excludes: 'superscript',
		parseDOM: [
			{ tag: 'sub' },
			{
				style: 'vertical-align',
				getAttrs: value => (value == 'sub' ? {} : false),
			},
		],
		toDOM() {
			return ['sub', 0];
		},

		commands({ markType }) {
			return {
				subscript: () => toggleMark(markType),
			};
		},

		keymap({ markType }) {
			return {
				// Shortcut based on Google Docs (https://support.google.com/docs/answer/179738).
				'Mod-,': toggleMark(markType),
			};
		},

		...options,
	});
