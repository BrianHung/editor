import { Node } from '@brianhung/editor';
import { getCellAttrs, setCellAttrs } from './schema';
export const TableHeader = (options?: Partial<Node>) =>
	Node({
		name: 'tableheader',
		attrs: {
			colspan: { default: 1 },
			rowspan: { default: 1 },
			colwidth: { default: null },
		},
		content: 'block+',
		tableRole: 'tableheader',
		isolating: true,
		parseDOM: [{ tag: 'th', getAttrs: getCellAttrs }],
		toDOM(node) {
			return ['th', setCellAttrs(node), 0];
		},
		...options,
	});
