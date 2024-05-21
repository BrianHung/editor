import { Mark, markInputRule } from '@brianhung/editor';
import { toggleMark } from 'prosemirror-commands';

export const Strikethrough = (options?: Partial<Mark>) =>
	Mark({
		name: 'strikethrough',

		parseDOM: [
			{ tag: 's' },
			{ tag: 'del' },
			{ tag: 'strike' },
			{
				style: 'text-decoration',
				getAttrs: (value: string) => value.includes('line-through') && null,
			},
		],
		toDOM() {
			return ['s', 0];
		},

		inputRules({ markType }) {
			return [markInputRule(/(?:~~)([^~\s]+(?:\s+[^~\s]+)*)(?:~~)$/, markType)];
		},

		commands({ markType }) {
			return {
				strikethrough: () => toggleMark(markType),
			};
		},

		keymap({ markType }) {
			return {
				'Mod-Shift-s': toggleMark(markType),
				'Mod-Shift-S': toggleMark(markType),
			};
		},

		...options,
	});
