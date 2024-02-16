import React, { memo } from 'react';
import ContextMenu from './contextmenu';
import Toolbar from './toolbar';

import './editor.css';

import { Doc } from '@brianhung/editor-doc';
import { Paragraph } from '@brianhung/editor-paragraph';
import { Text } from '@brianhung/editor-text';

import { BlockQuote } from '@brianhung/editor-blockquote';
import { Bold } from '@brianhung/editor-bold';
import { Code } from '@brianhung/editor-code';
import { CodeBlock } from '@brianhung/editor-codeblock';
import { EnumList } from '@brianhung/editor-enum-list';
import { HardBreak } from '@brianhung/editor-hardbreak';
import { Heading } from '@brianhung/editor-heading';
import { History } from '@brianhung/editor-history';
import { HorizontalRule } from '@brianhung/editor-horizontal-rule';
import { Italic } from '@brianhung/editor-italic';
import { ItemList } from '@brianhung/editor-item-list';
import { Link } from '@brianhung/editor-link';
import { ListItem } from '@brianhung/editor-list-item';
import { MathBlock, MathBlockNodeView } from '@brianhung/editor-mathblock';
import { Strikethrough } from '@brianhung/editor-strikethrough';
import { Table, TableCell, TableHeader, TableNodeView, TableRow } from '@brianhung/editor-table';
import { TodoItem, TodoItemNodeView } from '@brianhung/editor-todo-item';
import { TodoList } from '@brianhung/editor-todo-list';
import { Underline } from '@brianhung/editor-underline';

import { TextAlign } from '@brianhung/editor-text-align';
import { TextColor } from '@brianhung/editor-text-color';
import { TextStyle } from '@brianhung/editor-text-style';

import { FontFamily } from '@brianhung/editor-font-family';
import { Highlight } from '@brianhung/editor-highlight';

import '@brianhung/editor-codeblock-syntax-highlight/style/codeblock-syntax-highlight.css';
import '@brianhung/editor-emoji/style/emoji.css';
import '@brianhung/editor-table/style/table.css';
import '@brianhung/editor-todo-item/style/todo-item.css';
import '@brianhung/editor-toggle-item/style/toggle-item.css';
import '@brianhung/editor/style/core.css';

import '@brianhung/editor-math/style/math.css';
import '@brianhung/editor-mathblock/style/mathblock.css';

import { Plugin } from 'prosemirror-state';

import { DefaultKeymap, editorPropsToViewProps } from '@brianhung/editor';

import EditorWordCount from './EditorWordCount';

import { ProseMirror } from '@brianhung/editor-react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { EditorView } from 'prosemirror-view';
import { DragMenu } from './DragMenu';
import EditorCommandMenu from './EditorCommandMenu';
import { AutocompleteCommands } from './EditorCommandMenu/autocomplete-commands-plugin';
import EditorFloatingToolbar, { FloatingToolbarPlugin } from './EditorSelectionTooltip';
import { WindowView } from './WindowView';

export const EditorDemo = memo(() => {
	const [mount, setMount] = React.useState<HTMLElement | null>(null);
	const [editorState, setEditorState] = React.useState(
		() =>
			editorPropsToViewProps({
				content: JSON.parse(localStorage.getItem('content')),
				extensions: [
					Text(),
					Paragraph(),
					Doc(),

					BlockQuote(),
					HorizontalRule(),
					Heading(),

					CodeBlock(),

					TodoItem({
						nodeView: props => new TodoItemNodeView(props),
						// nodeView: ReactNodeView(DivComponent)
					}),

					TodoList(),

					ListItem(),
					ItemList(),
					EnumList(),

					HardBreak(),

					Link(),
					Bold(),
					Code(),
					Strikethrough(),
					Italic(),
					Underline(),
					Highlight(),

					History(),

					Table({
						nodeView: props => new TableNodeView(props),
					}),
					TableCell(),
					TableRow(),
					TableHeader(),

					MathBlock({
						nodeView: props => new MathBlockNodeView(props),
					}),

					DefaultKeymap(),

					TextStyle(),
					TextColor(),
					TextAlign(),
					FontFamily(),

					new Plugin({
						props: {
							handlePaste(view, event, slice) {
								console.log('handlePaste', view, event.clipboardData.getData('text/html'));
							},
						},
					}),

					new Plugin({
						props: {
							handleDOMEvents: {
								mouseover(view, event) {
									const pos = view.posAtDOM(event.target as HTMLElement, 0);
									const $pos = view.state.doc.resolve(pos);
								},
							},
						},
					}),

					AutocompleteCommands,
					FloatingToolbarPlugin(),
				],
			}).state
	);

	return (
		<div className="py-8">
			<div className="mx-auto max-w-screen-md space-y-2 rounded-sm border-2 border-gray-200" id="editor">
				<ProseMirror
					mount={mount}
					defaultState={editorState}
					dispatchTransaction={function dispatch(this: EditorView, tr) {
						this.updateState(this.state.apply(tr));
						localStorage.setItem('content', JSON.stringify(this.state.doc.toJSON()));
					}}
				>
					<Toolbar />
					<ContextMenu>
						<div className="p-4" ref={setMount} />
					</ContextMenu>
					<EditorCommandMenu />
					<EditorFloatingToolbar />
					<EditorWordCount state={editorState} setState={setEditorState} />
					<DragMenu />
					<WindowView />
				</ProseMirror>
			</div>
			<a
				href="https://github.com/brianhung/editor"
				className="absolute bottom-4 right-4 block h-8 w-8 rounded-full bg-white"
				title="view source code on GitHub"
				target="_blank"
			>
				<GitHubLogoIcon className="h-8 w-8" />
			</a>
		</div>
	);
});
