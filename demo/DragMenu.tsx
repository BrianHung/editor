import { useEditorEventCallback, useEditorEventListener, useEditorState } from '@brianhung/editor-react';
import { autoUpdate, FloatingPortal, useFloating } from '@floating-ui/react';
import React, { useState } from 'react';

import { DragHandleDots2Icon as DragIcon, PlusIcon } from '@radix-ui/react-icons';

import ArrowSquarePath from './icons/arrowSquarePath.svg?react';
import PaintPalette from './icons/paintPalette.svg?react';
import CopyIcon from './icons/squareOnSquare.svg?react';
import TrashIcon from './icons/trash.svg?react';

import { AllSelection, Command, NodeSelection, TextSelection } from 'prosemirror-state';

import { browser, serializeForClipboard } from '@brianhung/editor';
import { useEditorFocusRestore, usePointerDownKeepFocus } from './useEditorFocus';

import { defaultBlockAt } from '@brianhung/editor';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function createParagraph(above: -1 | 1): Command {
	return function (state, dispatch) {
		let sel = state.selection,
			{ $from, $to } = sel;
		if (sel instanceof AllSelection || $from.parent.inlineContent || $to.parent.inlineContent) return false;
		let type = defaultBlockAt($to.parent.contentMatchAt($to.indexAfter()));
		if (!type || !type.isTextblock) return false;
		if (dispatch) {
			let side = (above < 0 ? $from : $to).pos;
			let tr = state.tr.insert(side, type.createAndFill()!);
			tr.setSelection(TextSelection.create(tr.doc, side + 1));
			dispatch(tr.scrollIntoView());
		}
		return true;
	};
}

/// If a block node is selected, create an empty paragraph above it.
export const createParagraphAbove = createParagraph(-1);

/// If a block node is selected, create an empty paragraph below it.
export const createParagraphBelow = createParagraph(+1);

// This is very crude, but unfortunately both these browsers _pretend_
// that they have a clipboard API—all the objects and methods are
// there, they just don't work, and they are hard to test.
const brokenClipboardAPI = (browser.ie && browser.ie_version < 15) || (browser.ios && browser.webkit_version < 604);

export class Dragging {
	constructor(
		readonly slice: Slice,
		readonly move: boolean,
		readonly node?: NodeSelection
	) {}
}

const dragCopyModifier: keyof DragEvent = browser.mac ? 'altKey' : 'ctrlKey';

function eventCoords(event: MouseEvent) {
	return { left: event.clientX, top: event.clientY };
}

/**
 * Find nearest node with a node pmViewDesc. Only nodes should be draggable, not marks.
 * docView.nearestDesc(node, true)
 * @param node
 * @returns
 */
function nearestNodeWithViewDesc(node: HTMLElement) {
	for (let cur = node; cur; cur = cur.parentElement) {
		if (cur.pmViewDesc && cur.pmViewDesc.node) return cur;
	}
	return null;
}

/**
 * Requires `prosemirror-dropcursor` to show drop position.
 *
 * dropcursor good example of how to show drop position.
 * https://github.com/ProseMirror/prosemirror-dropcursor/blob/master/src/dropcursor.ts
 */
export const DragMenu = React.memo(() => {
	const state = useEditorState();
	const { onOpenCheckFocus, onCloseAutoFocus } = useEditorFocusRestore();

	const [isOpen, setIsOpen] = useState(false);

	const cursorPos = React.useRef<number | null>(null);

	const { refs, floatingStyles } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: 'left',
		middleware: [],
		whileElementsMounted: autoUpdate,
	});

	useEditorEventListener('mousemove', (view, event) => {
		window.requestAnimationFrame(() => {
			let pos = view.posAtCoords(eventCoords(event));
			if (!pos) return;

			/**
			 * Based on mousedown calculation to find nearest node when cursor is between nodes.
			 * https://github.com/ProseMirror/prosemirror-view/blob/master/src/input.ts
			 */
			let targetNode: Node, targetPos, node;
			if (pos.inside > -1) {
				// inside of a node
				targetNode = view.state.doc.nodeAt(pos.inside)!;
				targetPos = pos.inside;
				node = view.nodeDOM(pos.inside) as HTMLElement;
			} else {
				// between nodes and pos is in root node
				let $pos = view.state.doc.resolve(pos.pos);
				targetNode = $pos.nodeAfter || $pos.parent;
				targetPos = $pos.nodeAfter ? $pos.start(1) : pos.pos;
				node = view.nodeDOM(pos.pos) as HTMLElement;
			}

			if (targetPos == cursorPos.current) return undefined;
			if (node == null || node === view.dom) {
				return undefined;
			}

			refs.setPositionReference(node);
			setIsOpen(true);
			cursorPos.current = targetPos;
		});
	});

	/**
	 * Based on dragstart.
	 * https://github.com/ProseMirror/prosemirror-view/blob/master/src/input.ts
	 */
	const onDragStart = useEditorEventCallback(function dragStart(view, event: DragEvent) {
		let pos = cursorPos.current;
		let node;
		if (view.state.selection instanceof NodeSelection) {
			node = view.state.selection;
		} else if (pos) {
			node = NodeSelection.create(view.state.doc, pos);
			view.dispatch(view.state.tr.setSelection(node));
		}

		if (!node) return;

		let slice = (node || view.state.selection).content(),
			{ dom, text } = serializeForClipboard(view, slice);
		event.dataTransfer!.clearData();
		event.dataTransfer!.setData(brokenClipboardAPI ? 'Text' : 'text/html', dom.innerHTML);
		event.dataTransfer!.effectAllowed = 'copyMove';
		let domNode = view.nodeDOM(node.from) as HTMLElement;
		event.dataTransfer!.setDragImage(domNode, 0, 0);
		if (!brokenClipboardAPI) event.dataTransfer.setData('text/plain', text);
		view.dragging = new Dragging(slice, !event[dragCopyModifier], node);
	});

	const onMouseDown = useEditorEventCallback(function mouseDown(view, event: DragEvent) {
		let pos = cursorPos.current;
		let node;
		if (view.state.selection instanceof NodeSelection && false) {
			node = view.state.selection;
		} else if (pos) {
			node = NodeSelection.create(view.state.doc, pos);
			view.dispatch(view.state.tr.setSelection(node));
		}

		// This prevents dragging.
		// if (view.hasFocus()) {
		//   event.preventDefault();
		// }
	});

	const onMouseUp = useEditorEventCallback(function mouseUp(view, event: MouseEvent) {
		view.focus();
	});

	const onPointerDownKeepFocus = usePointerDownKeepFocus();

	const onClickCreateParagraph = useEditorEventCallback((view, event) => {
		let pos = cursorPos.current;
		let node;
		if (view.state.selection instanceof NodeSelection && false) {
			node = view.state.selection;
		} else if (pos) {
			node = NodeSelection.create(view.state.doc, pos);
			view.dispatch(view.state.tr.setSelection(node));
		}
		const command = event.altKey ? createParagraphAbove : createParagraphBelow;
		const { state, dispatch } = view;
		command(state, dispatch);
		view.focus();
	});

	return (
		isOpen && (
			<FloatingPortal>
				<div
					className="flex select-none items-center px-1 transition-transform duration-[0ms] ease-linear"
					ref={refs.setFloating}
					style={floatingStyles}
					aria-label="Typeahead menu"
					role="listbox"
					data-drag-menu=""
				>
					<TooltipWithContent
						content={
							<div className="shadow-dropdown-menu flex flex-col items-center rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white">
								<div>
									Click<span className="text-gray-400"> to add below</span>
								</div>
								<div>
									Option-click<span className="text-gray-400"> to add above</span>
								</div>
							</div>
						}
					>
						<button
							className="flex h-6 w-6 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100"
							onClick={onClickCreateParagraph}
							onMouseDown={onPointerDownKeepFocus}
						>
							<PlusIcon className="h-5 w-5" />
						</button>
					</TooltipWithContent>
					<DropdownMenu.Root>
						<TooltipWithContent
							content={
								<div className="shadow-dropdown-menu flex flex-col items-center rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white">
									<div>
										Drag<span className="text-gray-400"> to move</span>
									</div>
									<div>
										Click<span className="text-gray-400"> to open menu</span>
									</div>
								</div>
							}
						>
							<DropdownMenu.Trigger asChild>
								<button
									className="flex h-6 w-4 cursor-grab items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 focus:outline-0 aria-expanded:bg-gray-200"
									draggable={true}
									onDragStart={onDragStart}
									onMouseDown={onMouseDown}
									onMouseUp={onMouseUp}
									onPointerDown={onOpenCheckFocus}
								>
									<DragIcon className="h-5 w-5" />
								</button>
							</DropdownMenu.Trigger>
						</TooltipWithContent>

						<DropdownMenu.Portal>
							<DropdownMenu.Content
								className="shadow-dropdown-menu w-64 select-none rounded-md bg-white py-1.5 text-sm"
								sideOffset={4}
								side="left"
								loop={true}
								onCloseAutoFocus={onCloseAutoFocus}
							>
								{menuItems.map(item => (
									<DropdownMenu.Item
										className="group mx-1 flex h-7 cursor-pointer items-center rounded hover:bg-gray-200/75 focus-visible:outline-none data-[highlighted]:bg-gray-200/75 data-[highlighted]:ring-0"
										key={item.title}
									>
										<item.icon className="ml-2.5 mr-1 h-4 w-4" />
										<div className="mx-1.5">{item.title}</div>
									</DropdownMenu.Item>
								))}
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>
				</div>
			</FloatingPortal>
		)
	);
});

const menuItems = [
	{
		title: 'Delete',
		run(state, dispatch) {
			dispatch(state.tr.deleteSelection());
		},
		icon: TrashIcon,
	},
	{
		title: 'Duplicate',
		run(state, dispatch) {
			// dispatch(state.tr.replaceSelectionWith(state.selection.content()));
		},
		icon: CopyIcon,
	},
	{
		title: 'Turn into',
		run(state, dispatch) {
			// dispatch(state.tr.setNodeMarkup(state.selection.from, null, {}));
		},
		icon: ArrowSquarePath,
	},
	{
		title: 'Color',
		run(state, dispatch) {
			// dispatch(state.tr.setNodeMarkup(state.selection.from, null, {}));
		},
		icon: PaintPalette,
	},
];

import * as Tooltip from '@radix-ui/react-tooltip';

export function TooltipWithContent({ children, content, open, defaultOpen, onOpenChange, ...props }) {
	return (
		<Tooltip.Provider delayDuration={250} disableHoverableContent={true}>
			<Tooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
				<Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
				<Tooltip.Content side="bottom" align="center" {...props} sideOffset={4}>
					{content}
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
