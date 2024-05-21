import { Node, toggleListType } from '@brianhung/editor';
import { wrappingInputRule } from 'prosemirror-inputrules';

export const ToggleList = (options?: Partial<Node>) =>
	Node({
		name: 'togglelist',

		group: 'block list', // listGroup can be given to assign a group name to the list node types
		content: 'toggleitem+',
		toDOM: () => ['ul', { class: 'toggle-list' }, 0],
		parseDOM: [{ tag: 'ul.toggle-list' }],

		commands({ nodeType }) {
			return {
				toggleListType: () => toggleListType(nodeType),
			};
		},

		inputRules({ nodeType }) {
			return [wrappingInputRule(/^>>\s$/, nodeType)];
		},

		...options,
	});
