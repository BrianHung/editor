import { Node } from '@brianhung/editor';
import { setBlockType } from 'prosemirror-commands';
import { textblockTypeInputRule } from 'prosemirror-inputrules';
import type { Node as PMNode, NodeSpec } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

import { codeblockParseRules } from './codeblock-parserules.js';
export * from './codeblock-parserules.js';
export * from './markdown';

import { lineIndent, lineUndent, newLine, selectAllCodeBlock, toggleLineNumbers } from './keymaps.js';
import VSCodePaste from './VSCodePaste.js';

/**
 * Allows browser default behavior of line TextSelection on triple-click to pass-through.
 * Cannot use `handleTripleClick` as `event.preventDefault()` is called by ProseMirror.
 */
const tripleClickSelectLine = new Plugin({
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
});

export const CodeBlockSpec: NodeSpec = {
	attrs: { language: { default: null }, lineNumbers: { default: false } },
	content: 'text*',
	marks: '',
	group: 'block',
	code: true,
	defining: true,
	isolating: true, // allow for gap cursor
	parseDOM: [
		{
			tag: 'pre.codeblock',
			preserveWhitespace: 'full',
			getAttrs(dom: HTMLDivElement) {
				return {
					language: dom.dataset.language,
					lineNumbers: dom.dataset.lineNumbers !== undefined,
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
				...(node.attrs.language && { 'data-language': node.attrs.language }),
				...(node.attrs.lineNumbers && {
					'data-lineNumbers': node.attrs.lineNumbers,
				}),
			},
			['code', { spellcheck: 'false' }, 0],
		];
	},
};

export const CodeBlock = (options?: Partial<Node>) =>
	Node({
		name: 'codeblock',

		...CodeBlockSpec,

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
				'Ctrl-a': selectAllCodeBlock,
			};
		},

		inputRules({ nodeType }) {
			return [
				textblockTypeInputRule(/^```([\w\/+#-.]*)\n$/, nodeType, match => ({
					...(match[1] && { language: match[1] }),
				})),
			];
		},

		plugins() {
			return [VSCodePaste, tripleClickSelectLine];
		},

		...options,
	});

export default CodeBlock;

export function codeblock(config: {} = { typeName: 'codeblock' }) {
	const type = config.schema.nodes[config.typeName];
	return [VSCodePaste, tripleClickSelectLine];
}
