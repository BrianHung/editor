import { Extension } from '@brianhung/editor';
import { history, redo, undo } from 'prosemirror-history';

/**
 * https://github.com/ProseMirror/prosemirror-history
 */
export const History = (options?: Partial<Extension>) =>
	Extension({
		name: 'history',
		keymap() {
			return {
				'Mod-z': undo,
				'Mod-Z': undo,
				'Mod-y': redo,
				'Mod-Y': redo,
				'Shift-Mod-z': redo,
				'Shift-Mod-Z': redo,
			};
		},
		plugins() {
			return [history()];
		},
		commands() {
			return {
				undo: () => undo,
				redo: () => redo,
			};
		},
		...options,
	});

export * from 'prosemirror-history';
