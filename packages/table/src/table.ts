import { Node } from '@brianhung/editor';

import {
	addColumnAfter,
	addColumnBefore,
	addRowAfter,
	addRowBefore,
	createTable,
	deleteColumn,
	deleteRow,
	deleteTable,
	goToNextCell,
	mergeCells,
	setCellAttr,
	splitCell,
	toggleHeader,
	toggleHeaderCell,
	toggleHeaderColumn,
	toggleHeaderRow,
} from './commands.js';

import { columnResizing } from './column-resizing.js';
import { tableEditing } from './table-editing.js';

export const Table = (options?: Partial<Node>) =>
	Node({
		name: 'table',

		content: 'tablerow+',
		tableRole: 'table',
		isolating: true,
		group: 'block',
		parseDOM: [{ tag: 'table' }],
		toDOM() {
			return ['table', ['tbody', 0]];
		},

		commands() {
			return {
				addColumnBefore: () => addColumnBefore,
				addColumnAfter: () => addColumnAfter,
				deleteColumn: () => deleteColumn,
				addRowBefore: () => addRowBefore,
				addRowAfter: () => addRowAfter,
				deleteRow: () => deleteRow,
				deleteTable: () => deleteTable,
				mergeCells: () => mergeCells,
				splitCell: () => splitCell,
				toggleHeaderColumn: () => toggleHeader('column'),
				toggleHeaderColumnHere: () => toggleHeaderColumn,
				toggleHeaderRow: () => toggleHeader('row'),
				toggleHeaderRowHere: () => toggleHeaderRow,
				toggleHeaderCell: () => toggleHeaderCell,
				mergeOrSplit: () => (state, dispatch) => {
					if (mergeCells(state, dispatch)) {
						return true;
					}
					return splitCell(state, dispatch);
				},
				setCellAttr,
				goToNextCell: () => goToNextCell(1),
				goToPreviousCell: () => goToNextCell(-1),
				createTable,
			};
		},

		keymap({ nodeType }) {
			return {};
		},

		plugins() {
			return [columnResizing(), tableEditing({ allowTableNodeSelection: true })];
		},

		...options,
	});
