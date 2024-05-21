import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';

export const ViewFocusKey = new PluginKey('ViewHasFocus');
export const ViewFocusPlugin = new Plugin({
	key: ViewFocusKey,
	state: {
		init: () => false,
		apply(tr, focus) {
			return tr.getMeta(ViewFocusKey) ?? focus;
		},
	},
	props: {
		handleDOMEvents: {
			blur(view) {
				view.dispatch(view.state.tr.setMeta(ViewFocusKey, false));
			},
			focus(view) {
				view.dispatch(view.state.tr.setMeta(ViewFocusKey, true));
			},
		},
	},
});

/**
 * Tracks if selection is changing due to pointer events.
 */
export const SelectionChangePointerKey = new PluginKey('SelectionChangePointer');
export const SelectionChangePointerPlugin = new Plugin({
	key: SelectionChangePointerKey,
	state: {
		init: () => false,
		apply(tr, value, oldState, newState) {
			const pointerMove = PointerMoveKey.getState(newState);
			if (!pointerMove) return false;
			return tr.selectionSet ? tr.getMeta('pointer') : value;
		},
	},
});

/**
 * Tracks if mouse is moving after a mousedown.
 * https://github.com/ProseMirror/prosemirror-tables/blob/master/src/input.ts
 */
export const PointerMoveKey = new PluginKey('PointerMoveKey');
export const PointerMovePlugin = new Plugin({
	key: PointerMoveKey,
	state: {
		init: () => false,
		apply(tr, mousemove) {
			return tr.getMeta(PointerMoveKey) ?? mousemove;
		},
	},
	props: {
		handleDOMEvents: {
			pointerdown: function handlePointerDown(view: EditorView, startEvent: MouseEvent) {
				if (startEvent.ctrlKey || startEvent.metaKey) return;
				function stop(): void {
					view.dispatch(view.state.tr.setMeta(PointerMoveKey, false));
					view.root.removeEventListener('pointerup', stop);
					view.root.removeEventListener('dragstart', stop);
					view.root.removeEventListener('pointermove', move);
				}
				function move(): void {
					view.dispatch(view.state.tr.setMeta(PointerMoveKey, true));
					view.root.removeEventListener('pointermove', move);
				}
				view.root.addEventListener('pointerup', stop);
				view.root.addEventListener('dragstart', stop);
				view.root.addEventListener('pointermove', move);
			},
		},
	},
});

export const PseudoSelectionViewBlur = ({ style }) =>
	new Plugin({
		props: {
			// setup decorations on selection
			decorations(state) {
				const sel = state.selection;
				if (sel.empty || ViewFocusKey.getState(state)) return DecorationSet.empty;
				return DecorationSet.create(state.doc, [
					Decoration.inline(
						sel.from,
						sel.to,
						{
							nodeName: 'span',
							class: `ProseMirror-selection`,
							style: style || '',
						},
						{
							inclusiveStart: true,
							inclusiveEnd: true,
						}
					),
				]);
			},
		},
	});
