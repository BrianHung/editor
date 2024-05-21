import { Node, toggleBlockType } from '@brianhung/editor';
import { textblockTypeInputRule } from 'prosemirror-inputrules';
import type { Node as PMNode } from 'prosemirror-model';
import { Fragment } from 'prosemirror-model';
import { deleteMathBlock, lineIndent, lineUndent, newlineIndent } from './keymaps.js';

export const MathBlock = (options?: Partial<Node>) =>
	Node({
		name: 'mathblock',

		attrs: { language: { default: 'stex' }, lineNumbers: { default: false } },
		content: 'text*',
		marks: '',
		group: 'block',
		code: true,
		isolating: true,
		parseDOM: [
			{
				tag: 'pre.mathblock',
				preserveWhitespace: 'full',
			},
			{
				// Matches mathblocks from Wikipedia+Mediawiki.
				tag: 'dl',
				getAttrs(dom: HTMLDListElement) {
					if (
						dom.childElementCount !== 1 ||
						(dom.firstChild as Element).tagName !== 'DD' ||
						(dom.firstChild as Element).childElementCount !== 1 ||
						!(dom.firstChild.firstChild as Element).classList.contains('mwe-math-element')
					)
						return false;
					return null;
				},
				getContent(dom: HTMLDListElement, schema) {
					let content =
						dom.querySelector('math').getAttribute('alttext') ||
						dom.querySelector('img.mwe-math-fallback-image-inline').getAttribute('alt');
					return Fragment.from(schema.text(content)) as Fragment<typeof schema>;
				},
			},
			{
				tag: 'div.mwe-math-element',
				getContent(dom: HTMLDListElement, schema) {
					let content =
						dom.querySelector('math').getAttribute('alttext') ||
						dom.querySelector('img.mwe-math-fallback-image-display').getAttribute('alt');
					return Fragment.from(schema.text(content)) as Fragment<typeof schema>;
				},
			},
		],
		toDOM: (node: PMNode) => ['pre', { class: 'mathblock' }, ['code', { spellcheck: 'false' }, 0]],

		commands({ nodeType }) {
			return {
				mathblock: attrs => toggleBlockType(nodeType, attrs),
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
			return [textblockTypeInputRule(/^\$\$\$$/, nodeType), textblockTypeInputRule(/^\$\$\n$/, nodeType)];
		},

		...options,
	});
