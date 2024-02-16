import type { ResolvedPos } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';
import { Plugin, PluginKey, TextSelection, Transaction } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import { Decoration, DecorationSet } from 'prosemirror-view';

/**
 * Create a matcher that matches when a specific character is typed.
 * Used for @mentions and #tags.
 * @param {Regex} regexp
 * @returns {match}
 */
function positionMatcher(regexp: RegExp, pos: ResolvedPos) {
	const text = pos.doc.textBetween(pos.before(), pos.end(), '\0', '\0');
	let match = regexp.exec(text);
	if (match) {
		let from = pos.start() + match.index,
			to = from + match[0].length;
		if (from < pos.pos && to >= pos.pos) {
			return { range: { from, to }, query: match[1] || '', text: match[0] };
		}
	}
}

export interface AutocompletePlugin extends Plugin {
	onEnter?: (props: AutocompletePluginState & { view: EditorView }) => void;
	onLeave?: (props: AutocompletePluginState & { view: EditorView }) => void;
	onChange?: (props: AutocompletePluginState & { view: EditorView }) => void;
	onKeyDown?: (props: AutocompletePluginState & { view: EditorView; event: KeyboardEvent }) => boolean;
}

export interface AutocompletePluginProps {
	regexp: RegExp;
	pluginKey: PluginKey;
	style?: string;
	onEnter?: AutocompletePlugin['onEnter'];
	onLeave?: AutocompletePlugin['onLeave'];
	onChange?: AutocompletePlugin['onChange'];
	onKeyDown?: AutocompletePlugin['onKeyDown'];
}

export interface AutocompletePluginState {
	active: boolean;
	range: { from: number; to: number } | null;
	query: string | null;
	text: string | null;
}

const initialState: AutocompletePluginState = {
	active: false,
	range: null,
	query: null,
	text: null,
};

/**
 * Replace with something better maintained (?).
 * https://github.com/curvenote/editor/blob/main/packages/prosemirror-autocomplete
 * https://github.com/remirror/remirror/tree/main/packages/prosemirror-suggest
 * https://github.com/quartzy/prosemirror-suggestions
 * https://github.com/johanneswilm/prosemirror-suggestions
 * https://github.com/ccorcos/prosemirror-examples/blob/master/src/app/components/Autocomplete.tsx
 */

export function Autocomplete({
	regexp,
	pluginKey,
	style = '',
	onEnter,
	onChange,
	onLeave,
	onKeyDown,
}: AutocompletePluginProps) {
	const plugin: AutocompletePlugin = new Plugin({
		key: pluginKey,

		// this: PluginSpec
		// TODO: composing input https://github.com/ueberdosis/tiptap/issues/1449
		view() {
			return {
				update: (view: EditorView, prevState: EditorState) => {
					// Get plugin state from editor state and compute how plugin state has changed.
					const prev = this.key.getState(prevState) as AutocompletePluginState;
					const next = this.key.getState(view.state) as AutocompletePluginState;

					const started = !prev.active && next.active;
					const stopped = prev.active && !next.active;
					const changed = prev.active && next.active && prev.query !== next.query;

					// Handlers may not be set until after plugin is initialized.
					const props = { view, ...next };
					let plugin = this.key.get(view.state) as AutocompletePlugin;
					started && plugin.onEnter?.(props);
					stopped && plugin.onLeave?.(props);
					changed && plugin.onChange?.(props);

					// PSA: If external autocomplete is initialized after this plugin (s.t. onEnter is null),
					// external state should grab plugin state via key.getState(view.state).
				},
			};
		},

		// this: PluginInstance
		state: {
			init: (config, editorState) => initialState,
			apply: (tr: Transaction, prevState: AutocompletePluginState): AutocompletePluginState => {
				let trMeta = tr.getMeta(pluginKey);
				if (trMeta !== undefined) {
					return typeof trMeta === 'function' ? trMeta(prevState) : trMeta;
				}

				let $from = tr.selection.$from;
				// Autocomplete only on text selection and in non-code textblocks (similar to prosemirror-inputrules).
				if (
					tr.selection instanceof TextSelection &&
					tr.selection.empty &&
					!$from.parent.type.spec.code &&
					$from.parent.isTextblock
				) {
					let match = positionMatcher(regexp, $from);
					if (match) {
						return { active: true, ...match };
					}
				}
				return initialState;
			},
		},

		// this: PluginInstance
		props: {
			// call the keydown hook if autocomplete is active
			handleKeyDown(view, event) {
				let state = this.getState(view.state);
				if (!state.active) return false;
				let plugin = this as AutocompletePlugin;
				return plugin.onKeyDown?.({ view, event, ...state });
			},

			// setup decorations on active autocomplete range
			decorations(editorState) {
				let state = this.getState(editorState);
				if (!state.active) return DecorationSet.empty;
				return DecorationSet.create(editorState.doc, [
					Decoration.inline(state.range.from, state.range.to, {
						nodeName: 'span',
						class: `ProseMirror-autocomplete ${style}`,
					}),
				]);
			},
		},
	});

	plugin.onEnter = onEnter;
	plugin.onLeave = onLeave;
	plugin.onChange = onChange;
	plugin.onKeyDown = onKeyDown;

	return plugin;
}

export default Autocomplete;
