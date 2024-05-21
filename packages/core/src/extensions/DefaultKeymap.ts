import { joinDown, joinUp, lift, selectParentNode } from 'prosemirror-commands';
import {
	cursorTextblockBoundaryBackward,
	cursorTextblockBoundaryForward,
	removeAllMarks,
	selectTextblock,
} from '../commands/index.js';
import { Extension } from '../extension.js';
/**
 * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/keymap.js
 */
export const DefaultKeymap = (options?: Partial<Extension>) =>
	Extension({
		name: 'keymaps',
		keymap() {
			return {
				'Alt-ArrowUp': joinUp,
				'Alt-ArrowDown': joinDown,
				'Mod-[': lift,
				Escape: selectParentNode,
				'Mod-c': selectTextblock,
				'Mod-x': selectTextblock,
				'Ctrl-Space': removeAllMarks,
				Home: cursorTextblockBoundaryBackward,
				End: cursorTextblockBoundaryForward,
			};
		},
		...options,
	});
