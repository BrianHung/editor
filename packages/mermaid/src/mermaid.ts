import { Node, toggleBlockType } from '@brianhung/editor';
import { textblockTypeInputRule } from 'prosemirror-inputrules';
import type { Node as PMNode } from 'prosemirror-model';
import { deleteMathBlock, lineIndent, lineUndent, newlineIndent } from './keymaps.js';

export const Mermaid = (options?: Partial<Node>) =>
	Node({
		name: 'mermaid',

		attrs: { language: { default: 'stex' }, lineNumbers: { default: false } },
		content: 'text*',
		marks: '',
		group: 'block',
		code: true,
		isolating: true,
		parseDOM: [
			{
				tag: 'pre.mermaid',
				preserveWhitespace: 'full',
			},
		],
		toDOM: (node: PMNode) => ['pre', { class: 'mermaid' }, ['code', { spellcheck: 'false' }, 0]],

		commands({ nodeType }) {
			return {
				mermaid: attrs => toggleBlockType(nodeType, attrs),
			};
		},

		keymap({ nodeType }) {
			return {
				Tab: lineIndent,
				'Shift-Tab': lineUndent,
				Enter: newlineIndent,
				Backspace: deleteMathBlock,
			};
		},

		inputRules({ nodeType }) {
			return [textblockTypeInputRule(/^```mermaid\n$/, nodeType)];
		},

		...options,
	});
