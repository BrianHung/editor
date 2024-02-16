import { browser } from '@brianhung/editor';
import { useEditorEffect, useEditorState } from '@brianhung/editor-react';
import {
	autoUpdate,
	detectOverflow,
	flip,
	FloatingPortal,
	inline,
	offset,
	shift,
	useFloating,
} from '@floating-ui/react';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, { useState } from 'react';
import Toolbar from '../toolbar';

function viewToDOMRect(view: EditorView): DOMRect {
	const sel = view.state.selection;
	const start = view.coordsAtPos(sel.from, +1);
	const end = view.coordsAtPos(sel.to, -1);

	const top = Math.min(start.top, end.top);
	const bottom = Math.max(start.bottom, end.bottom);
	const left = Math.min(start.left, end.left);
	const right = Math.max(start.right, end.right);

	const x = left;
	const y = top;
	const width = right - left;
	const height = bottom - top;

	return DOMRect.fromRect({ x, y, width, height });
}

export const SelectionToolbarPositioner = React.memo(props => {
	const state = useEditorState();
	const [isOpen, setIsOpen] = useState(false);
	const { refs, floatingStyles } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: 'top',
		middleware: [
			inline(),
			offset(8),
			flip(),
			shift(),
			{
				name: 'detectOverflow',
				async fn(state) {
					const overflow = await detectOverflow(state, {
						boundary: document.querySelector('#editor'),
					});
					return {
						data: {
							overflow,
						},
					};
				},
			},
		],
		whileElementsMounted: autoUpdate,
	});

	useEditorEffect(
		function menuPosition(view) {
			if (!view) return;

			const sel = view.state.selection;
			if (sel.empty) {
				setIsOpen(false);
				return;
			}

			const rect = viewToDOMRect(view);
			// refs.setPositionReference({
			// 	getBoundingClientRect: () => rect, // offscreen
			// 	getClientRects: () => new DOMRectList([rect]),
			// });

			const wSel = window.getSelection();
			if (wSel && !wSel.isCollapsed) {
				refs.setPositionReference(wSel.getRangeAt(0));
				setIsOpen(true);
			}
		},
		[state]
	);

	// useEditorEventListener("blur", (view, event) => {
	// 	setIsOpen(false);
	// 	return false;
	// })

	// useEditorEventListener("mousedown", (view, event) => {
	// 	setIsOpen(false);
	// 	return false;
	// })

	// useEditorEventListener("mouseup", (view, event) => {
	// 	setIsOpen(true);
	// 	return false;
	// })

	return (
		isOpen && (
			<FloatingPortal>
				<div
					className="shadow-dropdown-menu absolute flex h-8 select-none items-center justify-center overflow-y-hidden overscroll-contain rounded-md bg-white [overflow-x:overlay]"
					ref={refs.setFloating}
					style={floatingStyles}
					aria-label="Selection menu"
					role="listbox"
					data-selection-menu=""
				>
					{props.children}
				</div>
			</FloatingPortal>
		)
	);
});

export const EditorFloatingToolbar = React.memo(() => {
	if (browser.ios) return <></>;
	return (
		<SelectionToolbarPositioner>
			<Toolbar />
		</SelectionToolbarPositioner>
	);
});

export default EditorFloatingToolbar;

/**
 * Controls mousedown, mousedrag, mouseup.
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event
 * https://stackoverflow.com/questions/64424548/is-there-a-way-to-subscribe-to-changes-in-window-getselection
 */
class TooltipView {
	handlers: { name: string; handler: (event: Event) => void }[];
	constructor(readonly editorView: EditorView) {
		this.handlers = ['mousedown', 'mouseup'].map(name => {
			let handler = (e: Event) => {
				(this as any)[name](e);
			};
			editorView.dom.addEventListener(name, handler);
			return { name, handler };
		});
	}

	mousedown(event) {}

	mouseup(event) {}

	update(view, prevState) {}
}

/**
 * Controls state of tooltip, open close, position.
 */
class TooltipState {
	constructor(config, state) {}
	applyTransaction(tr) {}
}

const FloatingToolbarKey = new PluginKey('floatingToolbar');

export function FloatingToolbarPlugin() {
	return new Plugin({
		key: FloatingToolbarKey,
		state: {
			init(config, state: EditorState) {
				return new TooltipState(config, state);
			},
			apply(tr: Transaction, pluginState: TooltipState) {
				return pluginState; // pluginState.applyTransaction(tr);
			},
		},
		view(editorView) {
			return new TooltipView(editorView);
		},
		props: {
			handleDOMEvents: {
				selectionchange(view, event) {
					console.log('selectionchange', event);
					return false;
				},
				select(view, event) {
					console.log('select', event);
					return false;
				},

				// Emulate select event: show toolbar only after mouseup and hide during mousedown.
				mousedown(view, event) {
					console.log('mousedown', event);
					return false;
				},
				mouseup(view, event) {
					console.log('mouseup', event);
					return false;
				},
			},
		},
	});
}
