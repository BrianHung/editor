import { Mark, markInputRule } from '@brianhung/editor';
import { toggleMark } from 'prosemirror-commands';
export * from './markdown';

const DEFAULT_BACKGROUND_COLOR = 'transparent';

export const Highlight = (options?: Partial<Mark>) =>
	Mark({
		name: 'highlight',

		attrs: {
			color: {
				default: null,
			},
		},

		parseDOM: [
			{
				tag: 'mark',
				getAttrs: dom => {
					const color = dom.style.backgroundColor;
					if (!color || color === DEFAULT_BACKGROUND_COLOR) return false;
					return { color };
				},
			},
			{
				style: 'background-color',
				getAttrs: (color: string) => {
					if (!color || color === DEFAULT_BACKGROUND_COLOR) return false;
					return { color };
				},
			},
		],

		toDOM(mark) {
			const { color, ...attrs } = mark.attrs;
			const style = (attrs.style || '') + `background-color: ${color};`;
			return ['mark', { ...mark.attrs, style }, 0];
		},

		inputRules({ markType }) {
			return [markInputRule(/(?:==)([^=\s]+(?:\s+[^=\s]+)*)(?:==)$/, markType)];
		},

		commands({ markType }) {
			return {
				highlight: () => toggleMark(markType),
			};
		},

		keymap({ markType }) {
			return {
				'Mod-h': toggleMark(markType),
				'Mod-H': toggleMark(markType),
			};
		},

		...options,
	});

export default Highlight;
