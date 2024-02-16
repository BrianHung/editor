import { Mark } from '@brianhung/editor';

/**
 * Creates a generic span mark for inline text styles.
 * @param options
 * @returns
 */
export const TextStyle = (options?: Partial<Mark>) =>
	Mark({
		name: 'textStyle',
		group: 'inline',
		parseDOM: [
			{
				tag: 'span',
				getAttrs: element => {
					const hasStyles = (element as HTMLElement).hasAttribute('style');
					if (!hasStyles) {
						return false;
					}
					return {};
				},
			},
		],
		toDOM: mark => ['span', mark.attrs, 0],
		...options,
	});
