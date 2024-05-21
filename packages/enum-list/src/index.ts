import { Node, toggleListType } from '@brianhung/editor';
import { wrappingInputRule } from 'prosemirror-inputrules';
import type { Node as PMNode } from 'prosemirror-model';
export * from './markdown';

/**
 * https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol
 */
export const EnumList = (options?: Partial<Node>) =>
	Node({
		name: 'enumlist',

		attrs: { start: { default: 1 } },
		content: 'listitem+',
		group: 'block list', // listGroup can be given to assign a group name to the list node types
		parseDOM: [
			{
				tag: 'ol',
				getAttrs(dom: HTMLElement) {
					return {
						start: dom.hasAttribute('start') ? +dom.getAttribute('start')! : 1,
					};
				},
			},
		],
		toDOM(node: PMNode) {
			return ['ol', { class: 'enum-list', start: node.attrs.start }, 0];
		},

		commands({ nodeType }) {
			return {
				enumlist: () => toggleListType(nodeType),
			};
		},

		keymap({ nodeType }) {
			return {
				'Shift-Ctrl-1': toggleListType(nodeType),
			};
		},

		/**
		 * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/inputrules.js
		 */
		inputRules({ nodeType }) {
			return [
				wrappingInputRule(
					/^(\d+)\.\s$/,
					nodeType,
					([match, start]: RegExpExecArray) => ({ start: +start }),
					([match, start]: RegExpExecArray, node) => node.childCount + node.attrs.start === +start
				),
			];
		},

		...options,
	});

export default EnumList;
