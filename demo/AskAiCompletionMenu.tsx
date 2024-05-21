import React from 'react';

import Markdown from 'react-markdown';
import { SelectionToolbarPositioner } from './EditorSelectionTooltip';

import ArrowUpCircleFillIcon from './icons/arrowUpCircleFill.svg?react';
import SparklesIcon from './icons/sparkles.svg?react';

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

const selectionItems = [
	{ id: 'improve', label: 'Improve writing', value: 'Improve writing' },
	{ id: 'fix', label: 'Fix spelling & grammar', value: 'Fix spelling & grammar' },
	{ id: 'shorter', label: 'Make shorter', value: 'Make shorter' },
	{ id: 'longer', label: 'Make longer', value: 'Make longer' },
	{ id: 'tone', label: 'Change tone', value: 'Change tone' },
	{ id: 'simplify', label: 'Simplify language', value: 'Simplify language' },
];

const editorItems = [
	{
		title: 'Replace selection',
		label: 'Replace selection',
		run: text => (state, dispatch) => {
			const { from, to } = state.selection;
			const tr = state.tr;
			tr.insertText(text, from, to);
			tr.setSelection(TextSelection.create(tr.doc, from, from + text.length));
			dispatch(tr);
		},
	},
	{
		title: 'Insert below',
		label: 'Insert below',
		run: text => (state, dispatch) => {
			const { from, to } = state.selection;
			const tr = state.tr;
			tr.insertText(text, to);
			tr.setSelection(TextSelection.create(tr.doc, to, to + text.length));
			dispatch(tr);
		},
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
import { useCompletion } from 'ai/react';

import { defaultMarkdownSerializer } from './markdown';

function serializer() {
	return defaultMarkdownSerializer;
}

function selectionTextSerializer(state: EditorState) {
	const slice = state.selection.content();
	return slice.content.textBetween(0, slice.content.size, '\n\n');
}

const AskAiMenu = React.memo(props => {
	const { TriggerParent = React.Fragment } = props;
	const [open, setOpen] = React.useState(false);

	return (
		<div>
			<TriggerParent asChild>
				<button
					className="flex h-8 shrink-0 cursor-pointer items-center justify-center space-x-1 rounded-sm border border-transparent px-2 text-sm text-purple-500 hover:bg-gray-200/50 hover:text-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 focus-visible:ring-0 active:bg-gray-200 disabled:text-gray-200 aria-checked:bg-gray-200 aria-pressed:bg-gray-200"
					title="Ask AI"
					onClick={event => setOpen(open => !open)}
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
					>
						<AiCompletionComboBox />
					</SelectionToolbarPositioner>
				</DismissableLayer>
			)}
		</div>
	);
});

import { EditorState, TextSelection } from 'prosemirror-state';
import { ComboBox, Header, Input, ListBox, ListBoxItem, Popover, Section } from 'react-aria-components';

const AiCompletionComboBox = React.memo(props => {
	const state = useEditorState();

	const {
		completion,
		complete,
		isLoading,
		input = '',
		setInput,
		stop,
	} = useCompletion({
		api: '/api/ai',
		onResponse(resp) {
			if (resp.status === 429) {
				console.error('You have reached your request limit for the day.');
				return;
			}
		},
		onError(error) {
			console.error(error.message);
		},
	});

	const prompt = completion || selectionTextSerializer(state);
	const hasCompletion = completion.length > 0;

	return (
		<ComboBox
			menuTrigger="focus"
			aria-label="Generate text with AI"
			inputValue={input}
			onInputChange={setInput}
			onSelectionChange={useEditorEventCallback((view, key) => {
				const selItem = selectionItems.find(item => item.id === key);
				if (selItem) {
					requestAnimationFrame(() => {
						complete(prompt, { body: { command: selItem.value } });
						setInput('');
					});
				}
				const editItem = editorItems.find(item => item.title === key);
				if (editItem) {
					const { state, dispatch } = view;
					editItem.run(completion)(state, dispatch);
					setInput('');
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
			<div className="shadow-dropdown-menu flex w-full min-w-80 flex-col divide-y divide-gray-200 overflow-y-hidden overscroll-contain rounded-md bg-white [overflow-x:overlay]">
				{hasCompletion && (
					<Markdown className="max-h-[min(40vh,20rem)] max-w-prose overflow-y-auto bg-gray-100 px-4 py-2 text-sm">
						{completion}
					</Markdown>
				)}
				<div className="flex min-h-10 items-center">
					<SparklesIcon className="pointer-events-none absolute mx-2 h-5 w-5 shrink-0 text-purple-500" />
					{!isLoading && (
						<form
							className="flex w-full items-center"
							onSubmit={event => {
								complete(prompt, { body: { command: input } });
								setInput('');
							}}
						>
							<Input
								placeholder={hasCompletion ? 'Tell AI what to do next…' : 'Ask AI to edit or generate…'}
								className="grow pl-8 text-sm focus:outline-none"
								ref={ref => ref && requestAnimationFrame(() => ref.focus())} // manually autofocus; see https://github.com/adobe/react-spectrum/issues/5464
							/>
							<button
								className="mx-3 text-purple-500 disabled:text-gray-300"
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
						</form>
					)}
					{isLoading && (
						<>
							<div className="flex grow items-center space-x-2 pl-8">
								<span className="text-sm">AI is writing</span>
								<DotsBouncing />
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
				className="mt-1.5"
				isOpen={!isLoading}
				shouldFlip={false}
			>
				<ListBox className="shadow-dropdown-menu flex max-h-[min(40vh,20rem)] w-80 select-none flex-col items-center divide-y divide-gray-200 rounded-md bg-white text-sm data-[empty='true']:shadow-none">
					{hasCompletion && (
						<Section className="w-full py-1.5">
							<Header className="flex h-7 items-center px-3.5 text-xs font-medium text-gray-500">Finish</Header>
							{editorItems.map(item => (
								<ListBoxItem
									className="mx-1 flex min-h-7 cursor-pointer items-center rounded px-3 text-sm data-[focused]:bg-gray-200/75"
									id={item.title}
								>
									{item.label}
								</ListBoxItem>
							))}
						</Section>
					)}

					<Section className="w-full py-1.5">
						<Header className="flex h-7 items-center px-3.5 text-xs font-medium text-gray-500">
							{`Edit or review ${hasCompletion ? 'completion' : 'selection'}`}
						</Header>
						{selectionItems.map(item => (
							<ListBoxItem
								className="mx-1 flex min-h-7 cursor-pointer items-center rounded px-3 text-sm data-[focused]:bg-gray-200/75"
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

const DotsBouncing = () => {
	return (
		<div className="grid place-items-center gap-0.5">
			<div className="h-1 w-1 animate-bounce rounded-full bg-purple-500/85 [animation-delay:-0.30s]" />
			<div className="h-1 w-1 animate-bounce rounded-full bg-purple-500/85 [animation-delay:-0.15s]" />
			<div className="h-1 w-1 animate-bounce rounded-full bg-purple-500/85" />
		</div>
	);
};
