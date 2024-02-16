import type { EditorState } from 'prosemirror-state';
import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';

export const ContextMenuKey = new PluginKey('ContextMenu');

export const ContextMenuPlugin = new Plugin({
	key: ContextMenuKey,

	// this: PluginSpec
	view(view: EditorView) {
		const handleClick = (event: MouseEvent) => {
			let pluginState = this.key.getState(view.state);
			console.log('pluginState', pluginState);
			if (pluginState) {
				event.preventDefault();
				event.stopPropagation();

				console.log('event', event);
				this.key.getState(view.state);
				view.dispatch(view.state.tr.setMeta(ContextMenuKey, null));
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			let pluginState = this.key.getState(view.state);
			console.log('pluginState', pluginState);
			if (pluginState) {
				event.preventDefault();
				event.stopPropagation();

				console.log('event', event);
				event.key === 'Escape' && view.dispatch(view.state.tr.setMeta(ContextMenuKey, null));
			}
		};

		return {
			update: (view: EditorView, prevState: EditorState) => {
				// Get plugin state from editor state and compute how plugin state has changed.
				const prev = this.key.getState(prevState);
				const next = this.key.getState(view.state);

				// Start context menu
				if (!prev && next) {
					window.addEventListener('mousedown', handleClick, true);
					window.addEventListener('keydown', handleKeyDown, true);
				}

				// Leave context menu
				if (!next && prev) {
					// Remove event listeners to avoid memory leak.
					window.removeEventListener('mousedown', handleClick, true);
					window.removeEventListener('keydown', handleKeyDown, true);
				}
			},

			destroy: () => {},
		};
	},

	// this: PluginInstance
	state: {
		init: (config, editorState) => null,
		apply: (tr: Transaction, prevState) => {
			const nextState = tr.getMeta(ContextMenuKey);
			return nextState !== undefined ? nextState : prevState;
		},
	},

	// this: PluginInstance
	props: {
		handleDOMEvents: {
			contextmenu(view, event) {
				// event.preventDefault()
				// event.stopPropagation()
				console.log('event', event);
				view.dispatch(view.state.tr.setMeta(ContextMenuKey, [event.clientX, event.clientY]));
				return true;
			},
		},
	},
});
