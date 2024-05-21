import { Node, toggleListType } from '@brianhung/editor';

export const TodoList = (options?: Partial<Node>) =>
	Node({
		name: 'todolist',

		group: 'block list', // listGroup can be given to assign a group name to the list node types
		content: 'todoitem+',
		parseDOM: [{ tag: 'ul.todo-list', priority: 51 }],
		toDOM() {
			return ['ul', { class: 'todo-list' }, 0];
		},

		commands({ nodeType, schema }) {
			return {
				todolist: () => toggleListType(nodeType),
			};
		},

		keymap({ nodeType }) {
			return {
				'Shift-Ctrl-3': toggleListType(nodeType),
			};
		},

		...options,
	});
