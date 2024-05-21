import React, { memo } from 'react';

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

import { EditorState } from 'prosemirror-state';

import { editorPropsToViewProps } from '@brianhung/editor';

import { ProseMirror } from '@brianhung/editor-react';

import { CodeMirrorNodeViewPlugins } from '@brianhung/editor-codemirror';
import { History } from '@brianhung/editor-history';
import { Node } from 'prosemirror-model';
import { defaultMarkdownParser } from './markdown';

export const replaceDoc = (state: EditorState, doc) =>
	EditorState.create({
		schema: state.schema,
		selection: state.selection,
		storedMarks: state.storedMarks,
		plugins: state.plugins,
		doc,
	});

export const ProseMirrorMarkdown = memo<{ content: string | Node; className: string; editable?: boolean }>(props => {
	const { content = '', className = '', editable = true } = props;
	const doc = React.useMemo(
		() => (content instanceof Node ? content : defaultMarkdownParser.parse(content)!),
		[content]
	);

	const [mount, setMount] = React.useState<HTMLElement | null>(null);
	const [editorState, setEditorState] = React.useState(
		() =>
			editorPropsToViewProps({
				doc: doc,
				extensions: [
					Text(),
					Paragraph(),
					Doc(),

					BlockQuote(),
					HorizontalRule(),
					Heading(),

					CodeBlock(),
					...CodeMirrorNodeViewPlugins,

					TodoItem({
						nodeView: props => new TodoItemNodeView(props),
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

					Table({
						nodeView: props => new TableNodeView(props),
					}),
					TableCell(),
					TableRow(),
					TableHeader(),

					MathBlock({
						nodeView: props => new MathBlockNodeView(props),
					}),

					TextStyle(),
					TextColor(),
					TextAlign(),
					FontFamily(),

					History(),
				],
			}).state!
	);

	React.useEffect(() => setEditorState(state => replaceDoc(state, doc)), [doc]);
	const isEditable = React.useCallback(() => editable, [editable]);

	return (
		<ProseMirror
			mount={mount}
			state={editorState}
			dispatchTransaction={tr => {
				setEditorState(state => state.apply(tr));
			}}
			editable={isEditable}
		>
			<div
				className={className}
				ref={setMount}
			/>
		</ProseMirror>
	);
});
