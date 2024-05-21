import RedoIcon from './icons/arrowUturnBackward.svg?react';
import UndoIcon from './icons/arrowUturnForward.svg?react';
import BoldIcon from './icons/bold.svg?react';
import ListCheckIcon from './icons/checklistChecked.svg?react';
import CodeIcon from './icons/curlyBraces.svg?react';
import ItalicIcon from './icons/italic.svg?react';
import ListBulletIcon from './icons/listBullet.svg?react';
import ListNumberIcon from './icons/listNumber.svg?react';
import StrikethroughIcon from './icons/strikethrough.svg?react';
import TextAlignCenterIcon from './icons/textAlignCenter.svg?react';
import TextAlignLeftIcon from './icons/textAlignLeft.svg?react';
import TextAlignRightIcon from './icons/textAlignRight.svg?react';
import TextQuoteIcon from './icons/textQuote.svg?react';
import UnderlineIcon from './icons/underline.svg?react';

import * as ToolbarPrimitive from '@radix-ui/react-toolbar';
import React from 'react';

import { markActive, toggleMark } from '@brianhung/editor';
import { setTextAlign } from '@brianhung/editor-text-align';

import { useEditorEventCallback, useEditorState } from '@nytimes/react-prosemirror';

import { redo, undo } from '@brianhung/editor-history';

import { wrapIn } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';
import AskAiMenu from './AskAiMenu';
import BlockTypeMenu from './BlockTypeMenu';
import { TextColorMenu } from './TextColorMenu';
import { usePointerDownKeepFocus } from './useEditorFocus';

function schemaToMarkMenuItems(schema): any[] {
	return [
		{
			markType: schema.marks.bold,
			icon: BoldIcon,
		},
		{
			markType: schema.marks.italic,
			icon: ItalicIcon,
		},
		{
			markType: schema.marks.underline,
			icon: UnderlineIcon,
		},
		{
			markType: schema.marks.strikethrough,
			icon: StrikethroughIcon,
		},
		{
			markType: schema.marks.code,
			icon: CodeIcon,
		},
	];
}

const Toolbar = React.memo(props => {
	const { className = '' } = props;

	const state = useEditorState();
	const onPointerDownKeepFocus = usePointerDownKeepFocus();
	const markMenuItems = state.schema ? schemaToMarkMenuItems(state.schema) : [];

	const active = state
		? markMenuItems.reduce(
				(array, markMenuItem) =>
					markActive(state, markMenuItem.markType) ? [...array, markMenuItem.markType.name] : array,
				[]
			)
		: ([] as string[]);

	return (
		<ToolbarPrimitive.Root
			className={className}
			aria-label="Formatting options"
		>
			<AskAiMenu TriggerParent={ToolbarPrimitive.ToolbarButton} />
			<ToolbarPrimitive.Separator className="mx-1.5 my-auto h-6 w-px bg-gray-200" />
			<BlockTypeMenu TriggerParent={ToolbarPrimitive.ToolbarButton} />
			<ToolbarPrimitive.ToggleGroup
				className="flex items-center space-x-1"
				type="multiple"
				aria-label="Text formatting"
				value={active}
				onValueChange={useEditorEventCallback((view, value) => {
					if (!view) return;
					const { state, dispatch } = view;
					const mark = value.find(m => !active.includes(m)) || active.find(m => !value.includes(m));

					mark && toggleMark(state.schema.marks[mark], undefined)(state, dispatch);
				})}
			>
				{markMenuItems.map(menuItem => (
					<ToolbarPrimitive.ToggleItem
						className="grid h-7 w-7 cursor-pointer place-items-center rounded-md border border-transparent text-gray-900 hover:bg-gray-200/75 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-pressed:bg-gray-200"
						value={menuItem.markType.name}
						aria-label={menuItem.markType.name}
						onMouseDown={onPointerDownKeepFocus}
						key={menuItem.markType.name}
					>
						<menuItem.icon className="h-4 w-4" />
					</ToolbarPrimitive.ToggleItem>
				))}
			</ToolbarPrimitive.ToggleGroup>
			<ToolbarPrimitive.Separator className="mx-1.5 my-auto h-6 w-px bg-gray-200" />
			<ToolbarPrimitive.ToggleGroup
				className="flex items-center space-x-1"
				type="single"
				defaultValue="left"
				aria-label="Text alignment"
				onValueChange={useEditorEventCallback((view, value) => {
					if (!view) return;
					const { state, dispatch } = view;
					setTextAlign(value)(state, dispatch);
				})}
			>
				<ToolbarPrimitive.ToggleItem
					className="grid h-7 w-7 cursor-pointer place-items-center rounded-md border border-transparent text-gray-900 hover:bg-gray-200/75 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					value="left"
					aria-label="Left aligned"
					onMouseDown={onPointerDownKeepFocus}
				>
					<TextAlignLeftIcon className="h-4 w-4" />
				</ToolbarPrimitive.ToggleItem>
				<ToolbarPrimitive.ToggleItem
					className="grid h-7 w-7 cursor-pointer place-items-center rounded-md border border-transparent text-gray-900 hover:bg-gray-200/75 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					value="center"
					aria-label="Center aligned"
					onMouseDown={onPointerDownKeepFocus}
				>
					<TextAlignCenterIcon className="h-4 w-4" />
				</ToolbarPrimitive.ToggleItem>
				<ToolbarPrimitive.ToggleItem
					className="grid h-7 w-7 cursor-pointer place-items-center rounded-md border border-transparent text-gray-900 hover:bg-gray-200/75 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					value="right"
					aria-label="Right aligned"
					onMouseDown={onPointerDownKeepFocus}
				>
					<TextAlignRightIcon className="h-4 w-4" />
				</ToolbarPrimitive.ToggleItem>
			</ToolbarPrimitive.ToggleGroup>
			<ToolbarPrimitive.Separator className="mx-1.5 my-auto h-6 w-px bg-gray-200" />
			<div className="flex items-center space-x-1">
				<ToolbarPrimitive.Button
					className="grid h-7 w-7 cursor-pointer place-items-center rounded-md border border-transparent text-gray-900 hover:bg-gray-200/75 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:cursor-auto disabled:text-gray-200 disabled:hover:bg-transparent aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					title="undo"
					disabled={Boolean(!state || !undo(state))}
					onMouseDown={useEditorEventCallback((view, event) => {
						if (!view) return;
						if (view.hasFocus()) {
							event.preventDefault();
							view.focus();
						}
						const { state, dispatch } = view;
						undo(state, dispatch);
					})}
				>
					<UndoIcon className="h-4 w-4" />
				</ToolbarPrimitive.Button>
				<ToolbarPrimitive.Button
					className="grid h-7 w-7 cursor-pointer place-items-center rounded-md border border-transparent text-gray-900 hover:bg-gray-200/75 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:cursor-auto disabled:text-gray-200 disabled:hover:bg-transparent aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					title="redo"
					disabled={Boolean(!state || !redo(state))}
					onMouseDown={useEditorEventCallback((view, event) => {
						if (!view) return;
						if (view.hasFocus()) {
							event.preventDefault();
							view.focus();
						}
						const { state, dispatch } = view;
						redo(state, dispatch);
					})}
				>
					<RedoIcon className="h-4 w-4" />
				</ToolbarPrimitive.Button>
			</div>
			<ToolbarPrimitive.Separator className="mx-1.5 my-auto h-6 w-px bg-gray-200" />
			<div className="flex items-center space-x-1">
				<ToolbarPrimitive.Button
					className="grid h-7 w-7 cursor-pointer place-items-center rounded-md border border-transparent text-gray-900 hover:bg-gray-200/75 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:cursor-auto disabled:text-gray-200 disabled:hover:bg-transparent aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					title="bullet list"
					disabled={Boolean(!state || !wrapInList(state.schema.nodes.itemlist)(state))}
					onMouseDown={useEditorEventCallback((view, event) => {
						if (!view) return;
						if (view.hasFocus()) {
							event.preventDefault();
							view.focus();
						}
						const { state, dispatch } = view;
						wrapInList(state.schema.nodes.itemlist)(state, dispatch);
					})}
				>
					<ListBulletIcon className="h-4 w-4" />
				</ToolbarPrimitive.Button>
				<ToolbarPrimitive.Button
					className="grid h-7 w-7 cursor-pointer place-items-center rounded-md border border-transparent text-gray-900 hover:bg-gray-200/75 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:cursor-auto disabled:text-gray-200 disabled:hover:bg-transparent aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					title="number list"
					disabled={Boolean(!state || !wrapInList(state.schema.nodes.enumlist)(state))}
					onMouseDown={useEditorEventCallback((view, event) => {
						if (!view) return;
						if (view.hasFocus()) {
							event.preventDefault();
							view.focus();
						}
						const { state, dispatch } = view;
						wrapInList(state.schema.nodes.enumlist)(state, dispatch);
					})}
				>
					<ListNumberIcon className="h-4 w-4" />
				</ToolbarPrimitive.Button>
				<ToolbarPrimitive.Button
					className="grid h-7 w-7 cursor-pointer place-items-center rounded-md border border-transparent text-gray-900 hover:bg-gray-200/75 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:cursor-auto disabled:text-gray-200 disabled:hover:bg-transparent aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					title="todo list"
					disabled={Boolean(!state || !wrapInList(state.schema.nodes.todolist)(state))}
					onMouseDown={useEditorEventCallback((view, event) => {
						if (!view) return;
						if (view.hasFocus()) {
							event.preventDefault();
							view.focus();
						}
						const { state, dispatch } = view;
						!wrapInList(state.schema.nodes.todolist)(state, dispatch);
					})}
				>
					<ListCheckIcon className="h-4 w-4" />
				</ToolbarPrimitive.Button>
				<ToolbarPrimitive.Button
					className="grid h-7 w-7 cursor-pointer place-items-center rounded-md border border-transparent text-gray-900 hover:bg-gray-200/75 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:cursor-auto disabled:text-gray-200 disabled:hover:bg-transparent aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					title="quote"
					disabled={Boolean(!state || !wrapIn(state.schema.nodes.blockquote)(state))}
					onMouseDown={useEditorEventCallback((view, event) => {
						if (!view) return;
						if (view.hasFocus()) {
							event.preventDefault();
							view.focus();
						}
						const { state, dispatch } = view;
						wrapIn(state.schema.nodes.blockquote)(state, dispatch);
					})}
				>
					<TextQuoteIcon className="h-4 w-4" />
				</ToolbarPrimitive.Button>
				<TextColorMenu
					className="grid h-7 w-7 cursor-pointer place-items-center rounded-md border border-transparent text-gray-900 hover:bg-gray-200/75 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-pressed:bg-gray-200"
					TriggerAs={ToolbarPrimitive.Button}
				/>
			</div>
		</ToolbarPrimitive.Root>
	);
});

export default Toolbar;
