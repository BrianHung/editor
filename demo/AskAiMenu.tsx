import React from 'react';

import { SelectionToolbarPositioner } from './EditorSelectionTooltip';
import ArrowUpCircleFillIcon from './icons/arrowUpCircleFill.svg?react';
import ChevronLeftIcon from './icons/chevronLeft.svg?react';
import ChevronRightIcon from './icons/chevronRight.svg?react';
import SparklesIcon from './icons/sparkles.svg?react';
import StopCircleFillIcon from './icons/stopCircleFill.svg?react';

const items = [
	'Improve writing',
	'Fix spelling & grammar',
	'Make shorter',
	'Make longer',
	'Change tone',
	'Simplify language',
];

const tones = ['Professional', 'Casual', 'Straightforward', 'Confident', 'Friendly'];

const languages = [
	'English',
	'Korean',
	'Chinese',
	'Japanese',
	'Spanish',
	'Russian',
	'French',
	'Portuguese',
	'German',
	'Italian',
	'Dutch',
	'Indonesian',
	'Filipino',
	'Vietnamese',
];

/**
 * https://github.com/swyxio/ai-notes/blob/main/Resources/Notion%20AI%20Prompts.md
 */
const selectionItems = [
	{ id: 'improve', label: 'Improve writing', value: 'Improve writing' },
	{ id: 'fix', label: 'Fix spelling & grammar', value: 'Fix spelling & grammar' },
	{ id: 'shorter', label: 'Make shorter', value: 'Make shorter' },
	{ id: 'longer', label: 'Make longer', value: 'Make longer' },
	{ id: 'tone', label: 'Change tone', value: 'Change tone' },
	{ id: 'simplify', label: 'Simplify language', value: 'Simplify language' },
];

import { z } from 'zod';

/**
 * Behaves like doPaste.
 * https://github.com/ProseMirror/prosemirror-view/blob/master/src/input.ts
 * @param tr
 * @param slice
 */
function replaceWithSlice(tr: Transaction, slice: Slice) {
	let singleNode = sliceSingleNode(slice);
	singleNode ? tr.replaceSelectionWith(singleNode) : tr.replaceSelection(slice);
	return tr.scrollIntoView().setMeta('paste', true).setMeta('uiEvent', 'paste');
}

const editorItems = [
	{
		title: 'Replace selection',
		label: 'Replace selection',
		run:
			(node: Node): Command =>
			(state, dispatch) => {
				const tr = state.tr;
				replaceWithSlice(tr, node.slice(1, node.content.size - 1));
				if (dispatch) dispatch(tr);
				return true;
			},
		parameters: z.string().describe('The text to replace the selection with.'),
		description: 'Replace the selection with the given text.',
	},
	{
		title: 'Insert below',
		label: 'Insert below',
		run:
			(node: Node): Command =>
			(state, dispatch) => {
				const tr = state.tr;
				tr.setSelection(TextSelection.create(tr.doc, tr.selection.to));
				replaceWithSlice(tr, node.slice(1, node.content.size - 1));
				if (dispatch) dispatch(tr);
			},
		parameters: z.string().describe('The text to insert below the selection.'),
		description: 'Insert the given text below the selection.',
	},
	{
		title: 'Try again',
		label: 'Try again',
	},
	{
		title: 'Discard',
		label: 'Discard',
	},
];

/**
 * Should be fully unmounted when selection changes?
 * https://github.com/steven-tey/novel/blob/main/apps/web/components/tailwind/generative/ai-selector.tsx
 *
 * selectionExists && menuOpen
 * selectionExists && editorFocused || focusedInside
 */

import { useEditorEventCallback, useEditorState } from '@brianhung/editor-react';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { useChat } from 'ai/react';

import { createMarkdownParser, defaultMarkdownSerializer } from './markdown';

function selectionMarkdown(state: EditorState) {
	const slice = state.selection.content();
	const doc = state.schema.topNodeType.create(null, slice.content);
	return defaultMarkdownSerializer.serialize(doc);
}

function parseMarkdown(schema, markdown: string) {
	return createMarkdownParser(schema).parse(markdown)!;
}

function sliceSingleNode(slice: Slice) {
	return slice.openStart == 0 && slice.openEnd == 0 && slice.content.childCount == 1 ? slice.content.firstChild : null;
}

const AskAiMenu = React.memo<{ onOpenChange: (open: boolean) => void }>(props => {
	const { TriggerParent = React.Fragment, onOpenChange = () => undefined } = props;
	const [open, setOpen] = React.useState(false);
	React.useEffect(() => onOpenChange(open), [open]);

	const state = useEditorState();
	return (
		<>
			<TriggerParent asChild>
				<button
					className="flex h-7 shrink-0 cursor-pointer select-none items-center justify-center space-x-1 rounded-md border border-transparent px-2 text-sm text-purple-500 transition-colors duration-[25ms] hover:bg-gray-200/50 hover:text-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:cursor-auto disabled:text-gray-200 disabled:hover:bg-transparent aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					title="Ask AI"
					onClick={event => setOpen(open => !open)}
					disabled={state.selection.empty}
				>
					<div className="flex items-center">
						<SparklesIcon className="h-5 w-5 shrink-0" />
						<span className="font-medium">Ask AI</span>
					</div>
				</button>
			</TriggerParent>
			{open && (
				<DismissableLayer
					onInteractOutside={event => setOpen(false)}
					onFocusOutside={event => setOpen(false)}
				>
					<SelectionToolbarPositioner
						placement="bottom-start"
						className=""
						defaultOpen={open}
						hideWhenBlurred={true}
						sideOffset={6}
						id="ask-ai-menu"
					>
						<AiCompletionComboBox />
					</SelectionToolbarPositioner>
				</DismissableLayer>
			)}
		</>
	);
});

import { Command, EditorState, TextSelection, Transaction } from 'prosemirror-state';
import { ComboBox, Header, Input, ListBox, ListBoxItem, Popover, Section } from 'react-aria-components';
import { ProseMirrorMarkdown } from './ProseMirrorMarkdown';

import { parser } from '@lezer/markdown';
import MarkdownIt from 'markdown-it';
import { Node, Slice } from 'prosemirror-model';

const mdParser = MarkdownIt('commonmark', { html: false });

const completion = '# hello\n\n## hello world\n\n**b** asdsad *asdasd*';

console.log(
	'completion',
	completion,
	parser.parseInline(completion, 0),
	parser.parse(completion),
	mdParser.parse(completion)
);

const inputToUserMessage = (input = '', command: string) => ({
	content: `You have to respect the command: ${command}.
	 For this text: ${input}.
	`,
	role: 'user' as const,
	createdAt: new Date(),
});

const AiCompletionComboBox = React.memo(props => {
	const state = useEditorState();

	const [clientApiKey, setClientApiKey] = React.useState('');

	const [index, setIndex] = React.useState(-1);
	const { messages, append, input, setInput, stop, isLoading } = useChat({
		api: '/api/chat',
		onResponse(resp) {
			if (resp.status === 429) {
				const apiKey = window.prompt('You have reached your request limit. Enter your OpenAI API key to continue.');
				setClientApiKey(apiKey || '');
				return;
			}
		},
		onError(error) {
			alert(error.message);
		},
		body: {
			clientApiKey,
		},
	});

	const assistantMessages = messages.filter(message => message.role === 'assistant');
	React.useEffect(() => setIndex(assistantMessages.length - 1), [assistantMessages.length]);

	const completion = assistantMessages.at(index);
	const prompt = completion?.content ?? selectionMarkdown(state);
	const hasCompletion = completion !== undefined;

	return (
		<ComboBox
			className="mb-[10vh]"
			menuTrigger="focus"
			aria-label="Generate text with AI"
			inputValue={input}
			onInputChange={setInput}
			onSelectionChange={useEditorEventCallback((view, key) => {
				const selItem = selectionItems.find(item => item.id === key);
				if (selItem) {
					requestAnimationFrame(() => {
						append(inputToUserMessage(prompt, selItem.value));
						setInput('');
					});
				}
				const editItem = editorItems.find(item => item.title === key);
				if (editItem && completion) {
					const { state, dispatch } = view;
					editItem.run(parseMarkdown(state.schema, completion.content))(state, dispatch);
					setInput('');
					view.focus();
				}
			})}
			defaultItems={selectionItems}
			allowsCustomValue
			formValue="text"
			onKeyDown={useEditorEventCallback((view, event) => {
				if (event.key === 'Escape') {
					if (input) {
						setInput('');
					} else {
						view.focus(); // focus back to editor and close the menu
					}
				}
			})}
		>
			<div className="shadow-dropdown-menu flex w-full min-w-80 flex-col divide-y divide-gray-200 rounded-md bg-white [overflow-x:overlay]">
				{hasCompletion && (
					<ProseMirrorMarkdown
						className="prose-sm max-h-[min(40vh,20rem)] max-w-full overflow-y-auto bg-gray-100 px-4 py-2"
						content={completion?.content}
						editable={!isLoading}
					/>
				)}
				<div className="flex min-h-10 items-center">
					{!isLoading && (
						<form
							className="flex h-10 w-full items-center gap-2 pr-2"
							onSubmit={event => {
								append(inputToUserMessage(prompt, input));
								setInput('');
							}}
						>
							<SparklesIcon className="pointer-events-none absolute mx-3 h-5 w-5 shrink-0 text-purple-500" />
							<Input
								placeholder={hasCompletion ? 'Tell AI what to do next…' : 'Ask AI to edit or generate…'}
								className="h-full grow pl-9 text-sm focus:outline-none"
								ref={ref => ref && requestAnimationFrame(() => ref.focus())} // manually autofocus; see https://github.com/adobe/react-spectrum/issues/5464
							/>
							<button
								className="text-purple-500 disabled:text-gray-300"
								disabled={!input}
								title="Send to AI"
								type="submit"
							>
								<ArrowUpCircleFillIcon className="h-5 w-5 shrink-0" />
							</button>
							<input
								type="submit"
								hidden
							/>
							{assistantMessages.length > 1 && (
								<div className="flex h-9 items-center space-x-2">
									<div
										className="ml-1 h-6 w-px bg-gray-200"
										role="separator"
										aria-orientation="vertical"
									/>
									<div className="flex items-center space-x-0.5">
										<button
											className="grid h-5 w-5 place-items-center rounded text-gray-400 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent"
											disabled={index === 0}
											title="Go to prev AI response"
											onClick={event => {
												event.preventDefault();
												setIndex(index => index - 1);
											}}
										>
											<ChevronLeftIcon className="h-4 w-4 shrink-0" />
										</button>
										<span className="select-none text-xs tabular-nums text-gray-400">{`${index + 1} of ${assistantMessages.length}`}</span>
										<button
											className="grid h-5 w-5 place-items-center rounded text-gray-400 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent"
											disabled={index === assistantMessages.length - 1}
											title="Go to next AI response"
											onClick={event => {
												event.preventDefault();
												setIndex(index => index + 1);
											}}
										>
											<ChevronRightIcon className="h-4 w-4 shrink-0" />
										</button>
									</div>
								</div>
							)}
						</form>
					)}
					{isLoading && (
						<>
							<SparklesIcon className="pointer-events-none absolute mx-3 h-5 w-5 shrink-0 text-purple-500" />
							<div className="flex grow items-center space-x-2 pl-9">
								<span className="text-sm">AI is writing</span>
								<DotsLoading />
							</div>
							<button
								className="mx-3 text-purple-500 disabled:text-gray-300"
								title="Stop generation"
								type="submit"
								onClick={stop}
							>
								<StopCircleFillIcon className="h-5 w-5 shrink-0" />
							</button>
						</>
					)}
				</div>
			</div>
			<Popover
				isOpen={!isLoading}
				shouldFlip={false}
				offset={6}
			>
				<ListBox className="shadow-dropdown-menu mb-[10vh] flex max-h-[min(40vh,20rem)] w-80 select-none flex-col items-center divide-y divide-gray-200 overflow-hidden overflow-y-auto rounded-md rounded-md bg-white text-sm data-[empty='true']:shadow-none">
					{hasCompletion && (
						<Section className="w-full py-1.5">
							<Header className="flex h-7 items-center px-4 text-xs font-medium text-gray-500">
								Finish completion
							</Header>
							{editorItems.map(item => (
								<ListBoxItem
									className="mx-1 flex min-h-7 cursor-pointer scroll-m-8 items-center rounded px-3 text-sm data-[focused]:bg-gray-200/75"
									id={item.title}
								>
									{item.label}
								</ListBoxItem>
							))}
						</Section>
					)}
					<Section className="w-full py-1.5">
						<Header className="flex h-7 items-center px-4 text-xs font-medium text-gray-500">
							{`Edit or review ${hasCompletion ? 'completion' : 'selection'}`}
						</Header>
						{selectionItems.map(item => (
							<ListBoxItem
								className="mx-1 flex min-h-7 cursor-pointer scroll-m-8 items-center rounded px-3 text-sm data-[focused]:bg-gray-200/75"
								id={item.id}
							>
								{item.label}
							</ListBoxItem>
						))}
					</Section>
				</ListBox>
			</Popover>
		</ComboBox>
	);
});

export default AskAiMenu;

const DotsLoading = () => {
	return (
		<div className="grid grid-flow-col place-items-center gap-[3px]">
			<div className="h-1 w-1 animate-[bounce_1s_infinite,_pulse_1s_infinite] rounded-full bg-purple-500/85 [animation-delay:-0.30s]" />
			<div className="h-1 w-1 animate-[bounce_1s_infinite,_pulse_1s_infinite] rounded-full bg-purple-500/85 [animation-delay:-0.15s]" />
			<div className="h-1 w-1 animate-[bounce_1s_infinite,_pulse_1s_infinite] rounded-full bg-purple-500/85" />
		</div>
	);
};
