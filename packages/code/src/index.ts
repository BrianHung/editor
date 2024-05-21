import { Mark, markInputRule } from '@brianhung/editor';
import { toggleMark } from 'prosemirror-commands';
export * from './markdown';

export const Code = (options?: Partial<Mark>) =>
	Mark({
		name: 'code',

		parseDOM: [{ tag: 'code' }],
		toDOM() {
			return ['code', { spellCheck: 'false' }, 0];
		},

		inputRules({ markType }) {
			return [markInputRule(/(?:`)([^`]+)(?:`)$/, markType)];
		},

		keymap({ markType }) {
			return {
				'Mod-e': toggleMark(markType),
				'Mod-E': toggleMark(markType),
			};
		},

		commands({ markType }) {
			return {
				code: () => toggleMark(markType),
			};
		},

		...options,
	});

export default Code;
