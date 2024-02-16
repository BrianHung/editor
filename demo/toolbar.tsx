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
import BlockTypeMenu from './BlockTypeMenu';
import { TextColorMenu } from './TextColorMenu';
import { usePointerDownKeepFocus } from './useEditorFocus';

const TOOLBAR_MARKS = ['bold', 'italic', 'underline', 'strikethrough', 'code'];

const Toolbar = () => {
	const state = useEditorState();
	const onPointerDownKeepFocus = usePointerDownKeepFocus();

	const active = state
		? TOOLBAR_MARKS.reduce(
				(array, mark) => (markActive(state, state.schema.marks[mark]) ? [...array, mark] : array),
				[]
			)
		: ([] as string[]);

	return (
		<ToolbarPrimitive.Root
			className="sticky top-0 flex space-x-2 rounded-md bg-white px-4 py-2 [overflow-x:overlay] [&_button]:shrink-0"
			aria-label="Formatting options"
		>
			<BlockTypeMenu TriggerParent={ToolbarPrimitive.ToolbarButton} />
			<ToolbarPrimitive.Separator className="w-px bg-gray-200" />
			<ToolbarPrimitive.ToggleGroup
				className="flex space-x-1"
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
				<ToolbarPrimitive.ToggleItem
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-pressed:bg-gray-200"
					value="bold"
					aria-label="Bold"
					onMouseDown={onPointerDownKeepFocus}
				>
					<BoldIcon className="h-4 w-4" />
				</ToolbarPrimitive.ToggleItem>
				<ToolbarPrimitive.ToggleItem
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-pressed:bg-gray-200"
					value="italic"
					aria-label="Italic"
					onMouseDown={onPointerDownKeepFocus}
				>
					<ItalicIcon className="h-4 w-4" />
				</ToolbarPrimitive.ToggleItem>
				<ToolbarPrimitive.ToggleItem
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-pressed:bg-gray-200"
					value="underline"
					aria-label="Underline"
					onMouseDown={onPointerDownKeepFocus}
				>
					<UnderlineIcon className="h-4 w-4" />
				</ToolbarPrimitive.ToggleItem>
				<ToolbarPrimitive.ToggleItem
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-pressed:bg-gray-200"
					value="strikethrough"
					aria-label="strikethrough"
					onMouseDown={onPointerDownKeepFocus}
				>
					<StrikethroughIcon className="h-4 w-4" />
				</ToolbarPrimitive.ToggleItem>
				<ToolbarPrimitive.ToggleItem
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-pressed:bg-gray-200"
					value="code"
					aria-label="code"
					onMouseDown={onPointerDownKeepFocus}
				>
					<CodeIcon className="h-4 w-4" />
				</ToolbarPrimitive.ToggleItem>
			</ToolbarPrimitive.ToggleGroup>
			<ToolbarPrimitive.Separator className="w-px bg-gray-200" />
			<ToolbarPrimitive.ToggleGroup
				className="flex space-x-1"
				type="single"
				defaultValue="center"
				aria-label="Text alignment"
				onValueChange={useEditorEventCallback((view, value) => {
					if (!view) return;
					const { state, dispatch } = view;
					setTextAlign(value)(state, dispatch);
				})}
			>
				<ToolbarPrimitive.ToggleItem
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					value="left"
					aria-label="Left aligned"
					onMouseDown={onPointerDownKeepFocus}
				>
					<TextAlignLeftIcon className="h-4 w-4" />
				</ToolbarPrimitive.ToggleItem>
				<ToolbarPrimitive.ToggleItem
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					value="center"
					aria-label="Center aligned"
					onMouseDown={onPointerDownKeepFocus}
				>
					<TextAlignCenterIcon className="h-4 w-4" />
				</ToolbarPrimitive.ToggleItem>
				<ToolbarPrimitive.ToggleItem
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					value="right"
					aria-label="Right aligned"
					onMouseDown={onPointerDownKeepFocus}
				>
					<TextAlignRightIcon className="h-4 w-4" />
				</ToolbarPrimitive.ToggleItem>
			</ToolbarPrimitive.ToggleGroup>
			<ToolbarPrimitive.Separator className="w-px bg-gray-200" />
			<div className="flex space-x-1">
				<ToolbarPrimitive.Button
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:text-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
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
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:text-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
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
			<ToolbarPrimitive.Separator className="w-px bg-gray-200" />
			<div className="flex space-x-1">
				<ToolbarPrimitive.Button
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:text-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
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
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:text-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
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
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:text-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
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
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:text-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
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
					className="grid h-8 w-8 cursor-pointer place-items-center rounded-sm border border-transparent text-gray-900 hover:bg-gray-200/50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					TriggerAs={ToolbarPrimitive.Button}
				/>
			</div>
		</ToolbarPrimitive.Root>
	);
};

export default Toolbar;
