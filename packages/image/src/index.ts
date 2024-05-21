import { canInsert, Node } from '@brianhung/editor';
import type { Node as PMNode } from 'prosemirror-model';
export * from './markdown';

/**
 * https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
 */
export const Image = (options?: Partial<Node>) =>
	Node({
		name: 'image',

		attrs: {
			src: { default: null },
			alt: { default: null },
			title: { default: null },
		},
		inline: false,
		group: 'block',
		draggable: true,
		parseDOM: [
			{
				tag: 'img[src]',
				getAttrs(dom: HTMLElement) {
					return {
						src: dom.getAttribute('src'),
						title: dom.getAttribute('title'),
						alt: dom.getAttribute('alt'),
					};
				},
			},
		],
		toDOM(node: PMNode) {
			return ['img', node.attrs];
		},

		/**
		 * Taken from `enable` and `run`.
		 * https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/menu.js
		 */
		commands({ nodeType }) {
			return {
				image: attrs => (state, dispatch) => {
					if (!canInsert(state, nodeType)) return false;
					dispatch(state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)));
					return true;
				},
			};
		},

		...options,
	});

export default Image;
