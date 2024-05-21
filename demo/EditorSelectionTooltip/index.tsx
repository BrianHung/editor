import { useEditorEffect, useEditorState } from '@brianhung/editor-react';
import {
	autoUpdate,
	DetectOverflowOptions,
	FloatingPortal,
	inline,
	offset,
	Placement,
	shift,
	size,
	useFloating,
} from '@floating-ui/react';
import { EditorView } from 'prosemirror-view';
import React, { useState } from 'react';

import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { SelectionChangePointerKey, ViewFocusKey } from '../ViewPlugins';

/**
 * window.getSelection works for now.
 * https://discuss.prosemirror.net/t/how-to-get-a-selection-rect/3430
 * @param view
 * @returns
 */
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

	return new DOMRect(x, y, width, height);
}

/**
 * See how radix popper uses floating ui
 * https://github.com/radix-ui/primitives/blob/b32a93318cdfce383c2eec095710d35ffbd33a1c/packages/react/popper/src/Popper.tsx#L165
 */

function getPadding(el: HTMLElement) {
	const style = window.getComputedStyle(el);
	return {
		top: parseFloat(style.paddingTop),
		right: parseFloat(style.paddingRight),
		bottom: parseFloat(style.paddingBottom),
		left: parseFloat(style.paddingLeft),
	};
}

export const SelectionToolbarPositioner = React.memo(
	(
		props: {
			placement: Placement;
			defaultOpen: boolean;
			className: string;
			sideOffset: number;
			alignOffset: number;
			hideWhenBlurred?: boolean;
		} & React.PropsWithChildren
	) => {
		const {
			className = '',
			placement = 'top',
			defaultOpen = false,
			sideOffset = 8,
			alignOffset = 0,
			hideWhenBlurred = true,
		} = props;

		const state = useEditorState();
		const [open, setOpen] = useState(defaultOpen);

		const [editorRef, setEditorRef] = useState<HTMLElement | null>(null);
		const detectOverflowOptions = React.useMemo<DetectOverflowOptions>(
			() =>
				editorRef
					? {
							padding: getPadding(editorRef),
							boundary: [editorRef],
							altBoundary: true,
						}
					: {
							padding: 0,
							boundary: [],
							altBoundary: false,
						},
			[editorRef]
		);

		useEditorEffect(view => {
			setEditorRef(view.dom);
		}, []);

		const {
			refs,
			floatingStyles,
			placement: p,
			isPositioned,
			middlewareData,
		} = useFloating({
			strategy: 'absolute',
			open: open,
			onOpenChange: setOpen,
			placement: placement,
			middleware: [
				inline(), // requires `getBoundingClientRect` and `getClientRects`
				offset({ mainAxis: sideOffset, alignmentAxis: alignOffset }),
				// // flip(),
				shift({
					mainAxis: false,
					crossAxis: false,
					...detectOverflowOptions,
				}),
				size({
					apply({ elements, rects, availableWidth, availableHeight }) {
						const contentStyle = elements.floating.style;
						contentStyle.setProperty('max-width', `${availableWidth}px`);
						// contentStyle.setProperty('max-height', `${availableHeight}px`);
					},
					...detectOverflowOptions,
				}),
			],
			whileElementsMounted: (...args) =>
				autoUpdate(...args, {
					animationFrame: true,
					ancestorScroll: true, // portal
					ancestorResize: true,
					layoutShift: true,
				}),
		});

		useEditorEffect(
			function menuPosition(view) {
				const sel = view.state.selection;
				if (sel.empty) return setOpen(false);
				const selPointer = SelectionChangePointerKey.getState(state);
				if (selPointer) return setOpen(false);
				refs.setReference({
					getBoundingClientRect: () => viewToDOMRect(view), // offscreen
					getClientRects: () => [viewToDOMRect(view)] as any,
				});
				return setOpen(true);
			},
			[
				state.selection,
				SelectionChangePointerKey.getState(state), // hide on mousedown, show on mouseup
				ViewFocusKey.getState(state), // show on focus in editor
			]
		);

		return (
			open && (
				<FloatingPortal>
					<div
						className={className}
						ref={refs.setFloating}
						style={floatingStyles}
						aria-label="Selection menu"
						role="listbox"
						data-selection-menu=""
					>
						<DismissableLayer
							onInteractOutside={event => {
								if (ViewFocusKey.getState(state)) return;
								hideWhenBlurred && setOpen(false);
							}}
						>
							{props.children}
						</DismissableLayer>
					</div>
				</FloatingPortal>
			)
		);
	}
);
