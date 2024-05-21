// Various helper function for working with tables

import type { Node as PMNode, ResolvedPos } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';

import { tableNodeTypes } from './schema';
import { Rect, TableMap } from './tablemap';

import { PluginKey } from 'prosemirror-state';
export const TableEditingKey = new PluginKey('TableEditing');

export function cellAround($pos: ResolvedPos): ResolvedPos {
	for (let d = $pos.depth - 1; d > 0; d--)
		if ($pos.node(d).type.spec.tableRole == 'tablerow') return $pos.node(0).resolve($pos.before(d + 1));
	return null;
}

export function cellWrapping($pos: ResolvedPos): PMNode | null {
	// The cell can be in the same depth.
	for (let d = $pos.depth; d > 0; d--) {
		const role = $pos.node(d).type.spec.tableRole;
		if (role === 'cell' || role === 'tableheader') return $pos.node(d);
	}
	return null;
}

export function isInTable(state: EditorState): boolean {
	let $head = state.selection.$head;
	for (let d = $head.depth; d > 0; d--) if ($head.node(d).type.spec.tableRole == 'tablerow') return true;
	return false;
}

export function selectionCell(state: EditorState): ResolvedPos {
	let sel = state.selection as any;
	if (sel.$anchorCell) {
		return sel.$anchorCell.pos > sel.$headCell.pos ? sel.$anchorCell : sel.$headCell;
	} else if (sel.node && sel.node.type.spec.tableRole == 'tablecell') {
		return sel.$anchor;
	}
	return cellAround(sel.$head) || cellNear(sel.$head);
}

function cellNear($pos: ResolvedPos): ResolvedPos {
	for (let after = $pos.nodeAfter, pos = $pos.pos; after; after = after.firstChild, pos++) {
		let role = after.type.spec.tableRole;
		if (role === 'cell' || role === 'tableheader') return $pos.doc.resolve(pos);
	}
	for (let before = $pos.nodeBefore, pos = $pos.pos; before; before = before.lastChild, pos--) {
		let role = before.type.spec.tableRole;
		if (role === 'cell' || role === 'tableheader') return $pos.doc.resolve(pos - before.nodeSize);
	}
}

export function pointsAtCell($pos: ResolvedPos): PMNode {
	return $pos.parent.type.spec.tableRole == 'tablerow' && $pos.nodeAfter;
}

export function moveCellForward($pos: ResolvedPos): ResolvedPos {
	return $pos.node(0).resolve($pos.pos + $pos.nodeAfter.nodeSize);
}

export function inSameTable($a: ResolvedPos, $b: ResolvedPos): boolean {
	return $a.depth == $b.depth && $a.pos >= $b.start(-1) && $a.pos <= $b.end(-1);
}

export function findCell($pos: ResolvedPos): Rect {
	return TableMap.get($pos.node(-1)).findCell($pos.pos - $pos.start(-1));
}

export function colCount($pos: ResolvedPos) {
	return TableMap.get($pos.node(-1)).colCount($pos.pos - $pos.start(-1));
}

export function nextCell($pos: ResolvedPos, axis, dir) {
	let start = $pos.start(-1),
		map = TableMap.get($pos.node(-1));
	let moved = map.nextCell($pos.pos - start, axis, dir);
	return moved == null ? null : $pos.node(0).resolve(start + moved);
}

export function setAttr(attrs, name, value) {
	let result = Object.create(null);
	for (let prop in attrs) result[prop] = attrs[prop];
	result[name] = value;
	return result;
}

export function removeColSpan(attrs, pos, n = 1) {
	let result = setAttr(attrs, 'colspan', attrs.colspan - n);
	if (result.colwidth) {
		result.colwidth = result.colwidth.slice();
		result.colwidth.splice(pos, n);
		if (!result.colwidth.some(w => w > 0)) result.colwidth = null;
	}
	return result;
}

export function addColSpan(attrs, pos, n = 1) {
	let result = setAttr(attrs, 'colspan', attrs.colspan + n);
	if (result.colwidth) {
		result.colwidth = result.colwidth.slice();
		for (let i = 0; i < n; i++) result.colwidth.splice(pos, 0, 0);
	}
	return result;
}

export function columnIsHeader(map, table, col) {
	let headerCell = tableNodeTypes(table.type.schema).tableheader;
	for (let row = 0; row < map.height; row++)
		if (table.nodeAt(map.map[col + row * map.width]).type != headerCell) return false;
	return true;
}
