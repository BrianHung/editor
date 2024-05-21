import { Node } from '@brianhung/editor';
import { getCellAttrs, setCellAttrs } from './schema';
export const TableCell = (options?: Partial<Node>) =>
	Node({
		name: 'tablecell',
		attrs: {
			colspan: { default: 1 },
			rowspan: { default: 1 },
			colwidth: { default: null },
		},
		content: 'block+',
		tableRole: 'tablecell',
		isolating: true,
		parseDOM: [{ tag: 'td', getAttrs: getCellAttrs }],
		toDOM(node) {
			return ['td', setCellAttrs(node), 0];
		},
		...options,
	});
