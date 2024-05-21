import { blockTypeActive, runAllCommands, toggleListType, toggleWrapType, wrapTypeActive } from '@brianhung/editor';
import { useEditorEventCallback, useEditorState } from '@brianhung/editor-react';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';
import { setBlockType } from 'prosemirror-commands';
import { Attrs, NodeType, Schema } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import React from 'react';
import sprite from './sprite.svg';
import { useEditorFocusRestore } from './useEditorFocus';

/**
 * Similar to `MenuItemSpec`. TODO: Standardize this into editor-menu package.
 * https://github.com/ProseMirror/prosemirror-menu/blob/master/src/menu.ts
 * https://github.com/tldraw/tldraw/blob/main/packages/tldraw/src/lib/ui/hooks/useActions.tsx
 */
export interface MenuItemSpec {
	/// The function to execute when the menu item is activated.
	run: (state: EditorState, dispatch: (tr: Transaction) => void) => void;

	/// A predicate function to determine whether the item is 'active'.
	active?: (state: EditorState) => boolean;

	title: string;
	label: string;
	group: string;

	/// Describes an icon to show for this item.
	icon?: string;

	nodeType: NodeType;
	attrs?: Attrs | null;
}

function blockTypeItem(options) {
	let command = setBlockType(options.nodeType, options.attrs);
	let passedOptions: MenuItemSpec = {
		run: command,
		enable(state) {
			return command(state);
		},
		active(state) {
			return blockTypeActive(state, options.nodeType, options.attrs);
		},
	};
	for (let prop in options) (passedOptions as any)[prop] = (options as any)[prop];
	return passedOptions;
}

function wrapTypeItem(options) {
	let command = toggleWrapType(options.nodeType, options.attrs);
	let passedOptions: MenuItemSpec = {
		run: command,
		enable(state) {
			return command(state);
		},
		active(state) {
			return wrapTypeActive(state, options.nodeType, options.attrs);
		},
	};
	for (let prop in options) (passedOptions as any)[prop] = (options as any)[prop];
	return passedOptions;
}

// first content block of list can only be paragraph
function wrapListTypeItem(options) {
	let command = (state, dispatch) =>
		runAllCommands(setBlockType(state.schema.nodes.paragraph), toggleListType(options.nodeType))(state, dispatch);
	let passedOptions: MenuItemSpec = {
		run: command,
		enable(state) {
			return command(state);
		},
		active(state) {
			return wrapTypeActive(state, options.nodeType, options.attrs);
		},
	};
	for (let prop in options) (passedOptions as any)[prop] = (options as any)[prop];
	return passedOptions;
}

/**
 * menuItems = f(schema)
 * be dynamically constructed from schema rather than static, and filtered if command not applicable.
 * @param state
 * @returns
 */
function schemaToMenuItems(schema: Schema): MenuItemSpec[] {
	return [
		blockTypeItem({
			title: 'Text',
			label: 'Just start writing with plain text',
			group: 'basic',
			icon: 'text',
			nodeType: schema.nodes.paragraph,
		}),
		blockTypeItem({
			title: 'Heading 1',
			label: 'Big section heading.',
			group: 'basic',
			icon: 'heading1',
			nodeType: schema.nodes.heading,
			attrs: {
				level: 1,
			},
		}),
		blockTypeItem({
			title: 'Heading 2',
			label: 'Medium section heading.',
			group: 'basic',
			icon: 'heading2',
			nodeType: schema.nodes.heading,
			attrs: {
				level: 2,
			},
		}),
		blockTypeItem({
			title: 'Heading 3',
			label: 'Small section heading.',
			group: 'basic',
			icon: 'heading3',
			nodeType: schema.nodes.heading,
			attrs: {
				level: 3,
			},
		}),
		wrapListTypeItem({
			title: 'Bulleted List',
			label: 'Create a simple bulleted list.',
			group: 'lists',
			icon: 'item',
			nodeType: schema.nodes.itemlist,
		}),
		wrapListTypeItem({
			title: 'Numbered List',
			label: 'Create a list with numbering.',
			group: 'lists',
			icon: 'enum',
			nodeType: schema.nodes.enumlist,
		}),
		wrapListTypeItem({
			title: 'To-do List',
			label: 'Track tasks with a to-do list.',
			group: 'lists',
			icon: 'todo',
			nodeType: schema.nodes.todolist,
		}),
		wrapTypeItem({
			title: 'Quote',
			label: 'Capture a quote.',
			group: 'basic',
			icon: 'blockquote',
			nodeType: schema.nodes.blockquote,
		}),
		blockTypeItem({
			title: 'Code',
			label: 'Capture a code snippet.',
			group: 'advanced',
			icon: 'code',
			nodeType: schema.nodes.codeblock,
		}),
		blockTypeItem({
			title: 'Block equation',
			label: 'Display a math equation.',
			group: 'advanced',
			icon: 'mathblock',
			nodeType: schema.nodes.mathblock,
		}),
	];
}

/**
 * typeMenu in `prosemirror-example-setup`
 * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/menu.ts
 */
export const BlockTypeMenu = React.memo(props => {
	const { TriggerParent = React.Fragment } = props;

	const state = useEditorState();
	const menuItems = React.useMemo(() => (state ? schemaToMenuItems(state.schema) : []), [state && state.schema]);

	const { onOpenCheckFocus, onCloseAutoFocus } = useEditorFocusRestore();

	const activeMenuItem = React.useMemo(() => {
		if (state === null) return null;
		return menuItems.find(item => item.active?.(state));
	}, [state && state.selection, menuItems]);

	const disabled = !state || !state.selection.$from.sameParent(state.selection.$to);

	return (
		<Select.Root
			value={activeMenuItem ? activeMenuItem.title : undefined}
			onValueChange={useEditorEventCallback((view, title) => {
				const menuItem = menuItems.find(item => item.title === title);
				if (menuItem) {
					menuItem.run(view.state, view.dispatch);
				}
			})}
			disabled={disabled}
		>
			<TriggerParent asChild>
				<Select.Trigger
					className="flex h-7 w-fit items-center space-x-0.5 rounded-md px-2 text-sm tabular-nums hover:bg-gray-200/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 disabled:text-gray-300 disabled:hover:bg-transparent"
					title="Select a block type"
					onPointerDown={onOpenCheckFocus}
				>
					<Select.Value placeholder="Text"></Select.Value>
					<Select.Icon className="text-gray-400">
						<ChevronDownIcon className="h-3 w-3" />
					</Select.Icon>
				</Select.Trigger>
			</TriggerParent>
			<Select.Portal>
				<Select.Content
					className="shadow-dropdown-menu min-w-44 select-none rounded-md bg-white text-sm tabular-nums"
					onCloseAutoFocus={onCloseAutoFocus}
					data-block-type-menu=""
				>
					<Select.ScrollUpButton className="grid place-items-center text-gray-400">
						<ChevronUpIcon />
					</Select.ScrollUpButton>
					<Select.Viewport>
						<Select.Group className="py-1">
							<Select.Label className="flex h-7 items-center px-3.5 text-xs font-medium text-gray-500">
								Turn into
							</Select.Label>
							{menuItems.map(type => (
								<SelectItem
									key={type.title}
									value={type.title}
									{...type}
								>
									{type.title}
								</SelectItem>
							))}
						</Select.Group>
					</Select.Viewport>
					<Select.ScrollDownButton className="grid place-items-center text-gray-400">
						<ChevronDownIcon className="h-4 w-4" />
					</Select.ScrollDownButton>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
});

export default BlockTypeMenu;

const SelectItem = React.memo(props => {
	return (
		<Select.Item
			className={
				'data-[highlighted,state="checked"]:bg-sky-300 mx-1 flex h-7 cursor-pointer items-center space-x-2 rounded px-2.5 transition-colors duration-[25ms] focus-visible:outline-0 data-[highlighted]:bg-sky-100 data-[state="checked"]:bg-sky-200'
			}
			value={props.value}
		>
			<div className="overflow-hidden rounded border border-gray-200">
				<svg className="h-5 w-5 bg-white">
					<use href={`${sprite}#${props.icon}`} />
				</svg>
			</div>
			<Select.ItemText>{props.children}</Select.ItemText>
			<Select.ItemIndicator className="ml-1 flex grow justify-end">
				<CheckIcon />
			</Select.ItemIndicator>
		</Select.Item>
	);
});
