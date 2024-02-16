import { Extension, ExtensionSpec } from '@brianhung/editor';
import { FocusMode as FocusModePlugin, toggleFocusMode } from './focus-mode';

/**
 * Adds ability to toggle the class 'ProseMirror-focusmode' onto the parent ProseMirror DOM node.
 * Note: This extension requires the Placeholder extension to be used in conjuction.
 */
export const FocusMode = (options?: ExtensionSpec) =>
	Extension({
		name: 'focusMode',

		plugins() {
			return [FocusModePlugin()];
		},

		commands() {
			return {
				focusMode: focus => toggleFocusMode(focus),
			};
		},

		keymap() {
			return {
				'Shift-Ctrl-f': toggleFocusMode(),
			};
		},

		...options,
	});
