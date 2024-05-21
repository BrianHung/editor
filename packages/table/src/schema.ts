// Helper for creating a schema that supports tables.

import { NodeType, Schema } from 'prosemirror-model';

export function getCellAttrs(dom) {
	let widthAttr = dom.getAttribute('data-colwidth');
	let widths = widthAttr && /^\d+(,\d+)*$/.test(widthAttr) ? widthAttr.split(',').map(s => +s) : null;
	let colspan = +dom.getAttribute('colspan') || 1;
	let rowspan = +dom.getAttribute('rowspan') || 1;
	return {
		colspan,
		rowspan,
		colwidth: widths && widths.length == colspan ? widths : null,
	};
}

export function setCellAttrs(node) {
	let attrs = Object.create(null);
	if (node.attrs.colspan != 1) attrs.colspan = node.attrs.colspan;
	if (node.attrs.rowspan != 1) attrs.rowspan = node.attrs.rowspan;
	if (node.attrs.colwidth) attrs['data-colwidth'] = node.attrs.colwidth.join(',');
	return attrs;
}

// :: (Object) → Object
//
// This function creates a set of [node
// specs](http://prosemirror.net/docs/ref/#model.SchemaSpec.nodes) for
// `table`, `table_row`, and `table_cell` nodes types as used by this
// module. The result can then be added to the set of nodes when
// creating a a schema.
//
//   options::- The following options are understood:
//
//     tableGroup:: ?string
//     A group name (something like `"block"`) to add to the table
//     node type.
//
//     cellContent:: string
//     The content expression for table cells.
//
//     cellAttributes:: ?Object
//     Additional attributes to add to cells. Maps attribute names to
//     objects with the following properties:
//
//       default:: any
//       The attribute's default value.
//
//       getFromDOM:: ?(dom.Node) → any
//       A function to read the attribute's value from a DOM node.
//
//       setDOMAttr:: ?(value: any, attrs: Object)
//       A function to add the attribute's value to an attribute
//       object that's used to render the cell's DOM.

export function tableNodes(options) {
	let extraAttrs = options.cellAttributes || {};
	let cellAttrs = {
		colspan: { default: 1 },
		rowspan: { default: 1 },
		colwidth: { default: null },
	};

	for (let prop in extraAttrs) cellAttrs[prop] = { default: extraAttrs[prop].default };

	return {
		table: {
			content: 'table_row+',
			tableRole: 'table',
			isolating: true,
			group: options.tableGroup,
			parseDOM: [{ tag: 'table' }],
			toDOM() {
				return ['table', ['tbody', 0]];
			},
		},

		table_row: {
			content: '(table_cell | table_header)*',
			tableRole: 'row',
			parseDOM: [{ tag: 'tr' }],
			toDOM() {
				return ['tr', 0];
			},
		},

		table_cell: {
			content: options.cellContent,
			attrs: cellAttrs,
			tableRole: 'cell',
			isolating: true,
			parseDOM: [{ tag: 'td', getAttrs: dom => getCellAttrs(dom, extraAttrs) }],
			toDOM(node) {
				return ['td', setCellAttrs(node, extraAttrs), 0];
			},
		},

		table_header: {
			content: options.cellContent,
			attrs: cellAttrs,
			tableRole: 'tableheader',
			isolating: true,
			parseDOM: [{ tag: 'th', getAttrs: dom => getCellAttrs(dom, extraAttrs) }],
			toDOM(node) {
				return ['th', setCellAttrs(node, extraAttrs), 0];
			},
		},
	};
}

export function tableNodeTypes(schema: Schema): Record<string, NodeType> {
	let tableNodeTypes = schema.cached.tableNodeTypes;
	if (tableNodeTypes == null) {
		tableNodeTypes = schema.cached.tableNodeTypes = Object.create(null);
		for (let name in schema.nodes) {
			let type = schema.nodes[name];
			if (type.spec.tableRole) tableNodeTypes[name] = type;
		}
	}
	return tableNodeTypes;
}
