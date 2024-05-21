import { runAllCommands, toggleBlockType, toggleListType, toggleWrapType } from '@brianhung/editor';
import { useEditorEffect, useEditorEventCallback, useEditorState } from '@brianhung/editor-react';
import { autoUpdate, flip, FloatingPortal, offset, useFloating } from '@floating-ui/react';
import Fuse from 'fuse.js';
import { chainCommands, setBlockType } from 'prosemirror-commands';
import { Command, EditorState, Transaction } from 'prosemirror-state';
import React, { useState } from 'react';
import sprite from '../sprite.svg';
import { usePointerDownKeepFocus } from '../useEditorFocus';
import { AutocompleteCommandsKey } from './autocomplete-commands-plugin';

const clearQuery: Command = (state, dispatch) => {
	const menuState = AutocompleteCommandsKey.getState(state);
	if (menuState) {
		const { active, range } = menuState;
		if (active) {
			if (dispatch) {
				dispatch(state.tr.delete(range.from, range.to));
			}
			return true;
		}
	}
	return false;
};

export interface MenuItemSpec {
	/// The function to execute when the menu item is activated.
	run: (state: EditorState, dispatch: (tr: Transaction) => void) => void;

	title: string;
	label: string;
	group: string;

	/// Describes an icon to show for this item.
	icon?: string;
}

/**
 * Similar to `MenuItemSpec`.
 * https://github.com/ProseMirror/prosemirror-menu/blob/master/src/menu.ts
 *
 * TODO: Move menuItems into component such that menuItems = f(editorState) and can
 * be dynamically constructed from schema rather than static, and filtered if command not applicable.
 */
const menuItems: MenuItemSpec[] = [
	{
		title: 'Text',
		label: 'Just start writing with plain text.',
		run: (state, dispatch) => runAllCommands(setBlockType(state.schema.nodes.paragraph))(state, dispatch),
		group: 'basic',
		icon: 'text',
	},
	{
		title: 'Heading 1',
		label: 'Big section heading.',
		run: (state, dispatch) => runAllCommands(setBlockType(state.schema.nodes.heading, { level: 1 }))(state, dispatch),
		group: 'basic',
		icon: 'heading1',
	},
	{
		title: 'Heading 2',
		label: 'Medium section heading.',
		run: (state, dispatch) => runAllCommands(setBlockType(state.schema.nodes.heading, { level: 2 }))(state, dispatch),
		group: 'basic',
		icon: 'heading2',
	},
	{
		title: 'Heading 3',
		label: 'Small section heading.',
		run: (state, dispatch) => runAllCommands(setBlockType(state.schema.nodes.heading, { level: 3 }))(state, dispatch),
		group: 'basic',
		icon: 'heading3',
	},
	{
		title: 'Bulleted List',
		label: 'Create a simple bulleted list.',
		run: (state, dispatch) =>
			runAllCommands(
				setBlockType(state.schema.nodes.paragraph), // first content block of list can only be paragraph
				toggleListType(state.schema.nodes.itemlist)
			)(state, dispatch),
		group: 'lists',
		icon: 'item',
	},
	{
		title: 'Numbered List',
		label: 'Create a list with numbering.',
		run: (state, dispatch) =>
			runAllCommands(setBlockType(state.schema.nodes.paragraph), toggleListType(state.schema.nodes.enumlist))(
				state,
				dispatch
			),
		group: 'lists',
		icon: 'enum',
	},
	{
		title: 'To-do List',
		label: 'Track tasks with a to-do list.',
		run: (state, dispatch) =>
			runAllCommands(setBlockType(state.schema.nodes.paragraph), toggleListType(state.schema.nodes.todolist))(
				state,
				dispatch
			),
		group: 'lists',
		icon: 'todo',
	},
	{
		title: 'Quote',
		label: 'Capture a quote.',
		run: (state, dispatch) => runAllCommands(toggleWrapType(state.schema.nodes.blockquote))(state, dispatch),
		group: 'basic',
		icon: 'blockquote',
	},
	{
		title: 'Code',
		label: 'Capture a code snippet.',
		run: (state, dispatch) => runAllCommands(toggleBlockType(state.schema.nodes.codeblock))(state, dispatch),
		group: 'advanced',
		icon: 'code',
	},
	{
		title: 'Block equation',
		label: 'Display a math equation.',
		run: (state, dispatch) => runAllCommands(toggleBlockType(state.schema.nodes.mathblock))(state, dispatch),
		group: 'advanced',
		icon: 'mathblock',
	},
];

interface MenuState {
	items: MenuItemSpec[];
	index: number;
	query?: string;
	range?: { from: number; to: number };
}

const initMenuState = { items: groupAndFlatten(menuItems), index: 0 } as MenuState;

const fuse = new Fuse(menuItems, {
	threshold: 0.1,
	keys: [
		{
			name: 'title',
			weight: 0.7,
		},
		{
			name: 'label',
			weight: 0.3,
		},
	],
});

function groupItems(items: { group: string }[]) {
	return items.reduce((groups, item) => {
		(groups[item.group] = groups[item.group] || []).push(item);
		return groups;
	}, {} as any);
}

function groupAndFlatten(items: { group: string }[]) {
	const grouped = items.reduce((groups, item) => {
		(groups[item.group] = groups[item.group] || []).push(item);
		return groups;
	}, {} as any);
	return Object.values(grouped).flat();
}

function searchMenuItems(query: string) {
	const items = query ? fuse.search(query).map(r => r.item) : menuItems;
	return groupAndFlatten(items);
}

function loop(index: number, length: number, dir: -1 | 1) {
	return (index + dir + length) % length;
}

/**
 * Accessibility, this component should behave like a combobox hopefully.
 * https://react-spectrum.adobe.com/react-spectrum/ComboBox.html
 */
export const EditorCommandMenu = React.memo(() => {
	const state = useEditorState();
	const onPointerDownKeepFocus = usePointerDownKeepFocus();
	const [menuState, setMenuState] = useState<MenuState>(initMenuState);

	const menuStateRef = React.useRef(menuState);
	menuStateRef.current = menuState;

	const [isOpen, setIsOpen] = useState(false);
	const { refs, floatingStyles } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: 'bottom-start',
		middleware: [offset(8), flip()],
		whileElementsMounted: autoUpdate,
	});

	useEditorEffect(function menuStateFromPluginState(view) {
		if (!view) return;
		const plugin = AutocompleteCommandsKey.get(view.state);
		if (plugin) {
			plugin.onEnter = ({ query, range }) => {
				setMenuState({ query, range, index: 0, items: searchMenuItems(query) });
			};
			plugin.onChange = ({ query, range }) => {
				setMenuState({ query, range, index: 0, items: searchMenuItems(query) });
			};
			plugin.onLeave = ({ query, range }) => {
				setMenuState(initMenuState);
			};
			// TODO: Convert this into events like 'menu-item-up', 'submenu-open', etc.
			plugin.onKeyDown = ({ event }) => {
				switch (event.key) {
					case 'ArrowUp': {
						setMenuState(state => ({
							...state,
							index: loop(state.index, state.items.length, -1),
						}));
						return true;
					}
					case 'ArrowDown': {
						setMenuState(state => ({
							...state,
							index: loop(state.index, state.items.length, +1),
						}));
						return true;
					}
					case 'Tab':
					case 'Enter': {
						const menuState = menuStateRef.current;
						if (menuState.items.length > 0) {
							const { run } = menuState.items[menuState.index];
							runAllCommands(clearQuery, run)(view.state, view.dispatch);
						} else {
							clearQuery(view.state, view.dispatch);
						}
						return true;
					}
					case 'Escape': {
						clearQuery(view.state, view.dispatch);
						return true;
					}
					default:
						return false;
				}
			};
		}
		// Initialize menu state from plugin state.
		const initState = AutocompleteCommandsKey.getState(view.state);
		if (initState) {
			const { active, query, range } = initState;
			if (active) setMenuState({ query, range, index: 0, items: searchMenuItems(query) });
		}
	}, []);

	/**
	 * TODO: Close when editor is blurred.
	 */
	useEditorEffect(
		function menuPosition(view) {
			if (!view) return;
			const span = view.dom.querySelector('.ProseMirror-autocomplete');
			if (span) {
				refs.setPositionReference(span);
				setIsOpen(true);
			} else {
				refs.setPositionReference({
					getBoundingClientRect: () => new DOMRect(-9999, -9999, 0, 0), // offscreen
				});
				setIsOpen(false);
			}
		},
		[state]
	);

	const onClickClearQuery = useEditorEventCallback(view => {
		if (view) clearQuery(view.state, view.dispatch);
	});

	const grouped = groupItems(menuState.items);
	const selectedItem = menuState.items[menuState.index];

	return (
		isOpen && (
			<FloatingPortal>
				<div
					className="shadow-dropdown-menu absolute z-20 max-h-[40vh] w-72 select-none overscroll-contain rounded-md bg-white [overflow:overlay]"
					ref={refs.setFloating}
					style={floatingStyles}
					aria-label="Typeahead menu"
					role="listbox"
					data-command-menu=""
				>
					{menuState.items.length > 0 ? (
						<ul className="">
							{Object.entries(grouped).map(([group, items]) => (
								<div
									role="group"
									className="pb-1.5 pt-1 shadow-[rgba(55,55,55,0.10)_0px_-1px_0px]"
								>
									<div
										className="px-3.5 py-1.5 text-xs font-medium text-gray-500"
										key={group}
										role="label"
									>
										<span className="capitalize">{group}</span> blocks
									</div>
									{items.map(item => (
										<MenuItem
											key={item.title}
											isSelected={selectedItem === item}
											onMouseDown={onPointerDownKeepFocus}
											{...item}
										/>
									))}
								</div>
							))}
						</ul>
					) : (
						<button
							className="w-full px-3.5 py-2.5 text-left text-xs font-medium text-gray-500"
							onMouseDown={onPointerDownKeepFocus}
							onClick={onClickClearQuery}
						>
							No results
						</button>
					)}
				</div>
			</FloatingPortal>
		)
	);
});

const MenuItem = React.memo(function MenuItem({
	onMouseDown,
	isSelected,
	run,
	title,
	icon,
	label,
}: MenuItemSpec & {
	onMouseDown: React.MouseEventHandler<HTMLLIElement>;
	isSelected: boolean;
}) {
	const itemProps = {
		className: `flex w-[calc(100%-8px)] cursor-pointer space-x-2.5 px-2.5 py-1.5 transition-colors duration-[25ms] hover:bg-sky-100 aria-selected:bg-sky-200 aria-selected:active:bg-sky-300/75 aria-selected:hover:bg-sky-200 h-14 mx-1 rounded items-center`,
		role: 'option',
		onMouseDown,
		onClick: useEditorEventCallback(view => {
			if (view) chainCommands(clearQuery, run)(view.state, view.dispatch);
		}),
		'aria-selected': isSelected,
		...(isSelected && {
			style: { scrollMarginTop: '28px', scrollMarginBottom: '6px' }, // height of group label to prevent clipping when scrollIntoView
			ref: (elem?: HTMLElement) =>
				elem &&
				elem.scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
				}),
		}),
	};
	return (
		<li {...itemProps}>
			<div className="box-content h-11 w-11 overflow-hidden rounded border border-gray-200">
				<svg className="h-full w-full bg-white">
					<use href={`${sprite}#${icon}`} />
				</svg>
			</div>
			<div className="flex flex-col justify-center">
				<div className="text-sm text-gray-800">{title}</div>
				<div className="text-xs text-gray-500">{label}</div>
			</div>
		</li>
	);
});

export default EditorCommandMenu;
