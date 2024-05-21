import { Node } from '@brianhung/editor';
import { wrappingInputRule } from 'prosemirror-inputrules';
import type { Node as PMNode } from 'prosemirror-model';
import { liftListItem, sinkListItem, splitListItem } from 'prosemirror-schema-list';
import { toggleChecked } from './keymaps.js';

export const TodoItem = (options?: Partial<Node>) =>
	Node({
		name: 'todoitem',

		attrs: { checked: { default: false } },
		content: 'paragraph block*',
		// Prioritize todoItem over listItem in parsing order (default priority = 50).
		parseDOM: [
			{
				tag: 'li.todo-item',
				getAttrs: (dom: HTMLLIElement) => ({
					checked: dom.dataset.checked === 'true',
				}),
				priority: 51,
			},
		],
		toDOM(node: PMNode) {
			return [
				'li',
				{ class: 'todo-item', 'data-checked': node.attrs.checked },
				[
					'input',
					{
						class: 'todo-checkbox',
						type: 'checkbox',
						...(node.attrs.checked && { checked: '' }),
					},
				],
				['div', { class: 'todo-content' }, 0],
			];
		},

		inputRules({ nodeType }) {
			return [
				wrappingInputRule(/^\[(x| )?\]\s$/, nodeType, ([match, checked]: RegExpExecArray) => ({
					checked: checked === 'x',
				})),
			];
		},

		keymap({ nodeType }) {
			return {
				// "The expected keyboard shortcut for activating a checkbox is the Space key".
				// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role
				'Ctrl-Space': toggleChecked,
				Enter: splitListItem(nodeType),
				Tab: sinkListItem(nodeType),
				'Shift-Tab': liftListItem(nodeType),
				'Mod-[': liftListItem(nodeType),
				'Mod-]': sinkListItem(nodeType),
			};
		},

		...options,
	});
