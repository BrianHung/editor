import { EditorState, Plugin, PluginKey } from 'prosemirror-state';

// Expose plugin key to allow external commands.
export const FindReplaceKey = new PluginKey('FindReplace');

export default function FindReplace() {
	return new Plugin({
		state: {
			init(config, state) {
				return new FindReplaceState(state);
			},
			apply(tr, pluginState, prevState, nextState) {
				return pluginState.applyTransaction(tr);
			},
		},
		props: {
			decorations(state) {
				return this.getState(state).decorations;
			},
		},
		key: FindReplaceKey,
	});
}

class FindReplaceState {
	constructor(state: EditorState) {}
}
