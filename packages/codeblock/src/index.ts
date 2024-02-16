import { Node } from '@brianhung/editor';
import { setBlockType } from 'prosemirror-commands';
import { textblockTypeInputRule } from 'prosemirror-inputrules';
import type { Node as PMNode } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { codeblockParseRules } from './codeblock-parserules.js';
import { backspaceCodeBlock, lineIndent, lineUndent, newLine, toggleLineNumbers } from './keymaps.js';
import VSCodePaste from './VSCodePaste.js';

export const CodeBlock = (options?: Partial<Node>) =>
	Node({
		name: 'codeblock',

		attrs: { lang: { default: '' }, lineNumbers: { default: false } },
		content: 'text*',
		marks: '',
		group: 'block',
		code: true,
		isolating: true,
		parseDOM: [
			{
				tag: 'pre.codeblock',
				preserveWhitespace: 'full',
				getAttrs(dom: HTMLDivElement) {
					return {
						lang: dom.dataset.lang,
						lineNumbers: dom.dataset.linenumbers !== undefined,
					};
				},
			},
			...codeblockParseRules,
		],
		toDOM(node: PMNode) {
			return [
				'pre',
				{
					class: 'codeblock',
					...(node.attrs.lang && { 'data-lang': node.attrs.lang }),
					...(node.attrs.lineNumbers && {
						'data-linenumbers': node.attrs.lineNumbers,
					}),
				},
				['code', { spellcheck: 'false' }, 0],
			];
		},

		commands({ nodeType }) {
			return {
				codeblock: attrs => setBlockType(nodeType, attrs),
			};
		},

		keymap({ nodeType }) {
			return {
				'Shift-Ctrl-\\': setBlockType(nodeType),
				Tab: lineIndent,
				'Shift-Tab': lineUndent,
				Enter: newLine,
				'Ctrl-l': toggleLineNumbers,
				'Ctrl-L': toggleLineNumbers,
				Backspace: backspaceCodeBlock,
			};
		},

		inputRules({ nodeType }) {
			return [
				textblockTypeInputRule(/^```([\w\/+#-.]*)\n$/, nodeType, match => ({
					...(match[1] && { lang: match[1] }),
				})),
			];
		},

		plugins() {
			return [
				VSCodePaste,
				/**
				 * Allows browser default behavior of line TextSelection on triple-click to pass-through.
				 * Cannot use `handleTripleClick` as `event.preventDefault()` is called by ProseMirror.
				 */
				new Plugin({
					props: {
						handleDOMEvents: {
							mousedown(view, event) {
								const {
									selection: { $from, $to },
									schema,
								} = view.state;
								return $from.sameParent($to) && $from.parent.type === schema.nodes.codeblock && event.detail === 3;
							},
						},
					},
				}),
			];
		},

		...options,
	});

export default CodeBlock;
