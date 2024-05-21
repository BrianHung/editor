import { Node } from '@brianhung/editor';
import { chainCommands, exitCode } from 'prosemirror-commands';
export * from './markdown';

/**
 * https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
 */
export const HardBreak = (options?: Partial<Node>) =>
	Node({
		name: 'hardbreak',

		inline: true,
		group: 'inline',
		selectable: false,
		parseDOM: [{ tag: 'br' }],
		toDOM() {
			return ['br'];
		},

		commands({ nodeType }) {
			return {
				hardbreak: () => exitAndInsert(nodeType),
			};
		},

		keymap({ nodeType }) {
			return {
				'Mod-Enter': exitAndInsert(nodeType),
				'Shift-Enter': exitAndInsert(nodeType),
			};
		},

		...options,
	});

function exitAndInsert(nodeType) {
	return chainCommands(exitCode, (state, dispatch) => {
		dispatch(state.tr.replaceSelectionWith(nodeType.create()).scrollIntoView());
		return true;
	});
}

export default HardBreak;
