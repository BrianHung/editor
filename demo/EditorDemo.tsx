import React, { memo } from 'react';
import ContextMenu from './contextmenu';
import Toolbar from './EditorToolbar';

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
import { Image } from '@brianhung/editor-image';
import { Italic } from '@brianhung/editor-italic';
import { ItemList } from '@brianhung/editor-item-list';
import { Link } from '@brianhung/editor-link';
import { ListItem } from '@brianhung/editor-list-item';
import { MathBlock, MathBlockCodeMirrorNodeViewPlugin } from '@brianhung/editor-mathblock';
import { Strikethrough } from '@brianhung/editor-strikethrough';
import { Table, TableCell, TableHeader, TableNodeView, TableRow } from '@brianhung/editor-table';
import { TodoItem, TodoItemNodeViewPlugin } from '@brianhung/editor-todo-item';
import { TodoList } from '@brianhung/editor-todo-list';
import { Underline } from '@brianhung/editor-underline';

import { TextAlign } from '@brianhung/editor-text-align';
import { TextColor } from '@brianhung/editor-text-color';
import { TextStyle } from '@brianhung/editor-text-style';

import { FontFamily } from '@brianhung/editor-font-family';
import { Highlight } from '@brianhung/editor-highlight';

import { CodeMirrorNodeViewPlugins } from '@brianhung/editor-codemirror';

import { Mermaid, MermaidNodeViewPlugin } from '@brianhung/editor-mermaid';

import '@brianhung/editor-codeblock-syntax-highlight/style/codeblock-syntax-highlight.css';
import '@brianhung/editor-emoji/style/emoji.css';
import '@brianhung/editor-table/style/table.css';
import '@brianhung/editor-todo-item/style/todo-item.css';
import '@brianhung/editor-toggle-item/style/toggle-item.css';
import '@brianhung/editor/style/core.css';

import '@brianhung/editor-math/style/math.css';
import '@brianhung/editor-mathblock/style/mathblock.css';

import { DefaultKeymap, editorPropsToViewProps } from '@brianhung/editor';

import EditorWordCount from './EditorWordCount';

import { ProseMirror } from '@brianhung/editor-react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { EditorView } from 'prosemirror-view';
import { DragMenu } from './DragMenu';
import EditorCommandMenu from './EditorCommandMenu';
import { AutocompleteCommands } from './EditorCommandMenu/autocomplete-commands-plugin';
import EditorFloatingToolbar from './EditorFloatingToolbar';
import { WindowView } from './WindowView';

import {
	PointerMovePlugin,
	PseudoSelectionViewBlur,
	SelectionChangePointerPlugin,
	ViewFocusPlugin,
} from './ViewPlugins';

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

					Mermaid(),
					MermaidNodeViewPlugin(),

					CodeBlock(),
					...CodeMirrorNodeViewPlugins,

					TodoItem(),
					TodoItemNodeViewPlugin(),

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

					Image(),

					History(),

					Table({
						nodeView: props => new TableNodeView(props),
					}),
					TableCell(),
					TableRow(),
					TableHeader(),

					MathBlock(),
					MathBlockCodeMirrorNodeViewPlugin(),

					DefaultKeymap(),

					TextStyle(),
					TextColor(),
					TextAlign(),
					FontFamily(),

					PointerMovePlugin,
					SelectionChangePointerPlugin,
					ViewFocusPlugin,
					PseudoSelectionViewBlur({ style: 'background: rgba(45, 170, 219, 0.3);' }),

					AutocompleteCommands,
				],
			}).state!
	);

	return (
		<div className="py-8">
			<div
				className="mx-auto max-w-screen-md space-y-2 rounded-sm border-2 border-gray-200"
				id="editor"
			>
				<ProseMirror
					mount={mount}
					state={editorState}
					dispatchTransaction={function dispatch(this: EditorView, tr) {
						setEditorState(state => state.apply(tr));
						localStorage.setItem('content', JSON.stringify(tr.doc.toJSON()));
					}}
				>
					<Toolbar className="sticky top-0 flex items-center space-x-2 rounded-md bg-white px-4 py-2 [overflow-x:overlay] [&_button]:shrink-0" />
					<ContextMenu>
						<div
							className="p-4"
							ref={setMount}
						/>
					</ContextMenu>
					<EditorCommandMenu />
					<EditorFloatingToolbar />
					<EditorWordCount
						state={editorState}
						setState={setEditorState}
					/>
					<DragMenu />
					<WindowView />
					{/* <CodeBlockLangSelect /> */}
				</ProseMirror>
			</div>
			<a
				href="https://github.com/brianhung/editor"
				className="fixed bottom-4 right-4 block h-8 w-8 rounded-full bg-white"
				title="view source code on GitHub"
				target="_blank"
			>
				<GitHubLogoIcon className="h-8 w-8" />
			</a>
		</div>
	);
});
