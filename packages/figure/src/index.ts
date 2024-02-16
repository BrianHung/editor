import { Node } from '@brianhung/editor';
export const Figure = (options?: Partial<Node>) =>
	Node({
		name: 'figure',

		/**
		 * The HTML <figure> (Figure With Optional Caption) element represents self-contained content,
		 * potentially with an optional caption, which is specified using the <figcaption> element.
		 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
		 */
		content: 'image+ figcaption?',
		group: 'block',
		parseDOM: [
			{
				tag: 'figure',
				// Check for an image element
				getAttrs(dom: HTMLElement) {
					return dom.querySelector('img[src]') ? {} : false;
				},
			},
		],
		toDOM() {
			return ['figure', 0];
		},

		...options,
	});
