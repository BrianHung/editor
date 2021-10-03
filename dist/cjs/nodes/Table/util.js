"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.columnIsHeader = exports.addColSpan = exports.removeColSpan = exports.setAttr = exports.nextCell = exports.colCount = exports.findCell = exports.inSameTable = exports.moveCellForward = exports.pointsAtCell = exports.selectionCell = exports.isInTable = exports.cellWrapping = exports.cellAround = exports.key = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const tablemap_1 = require("./tablemap");
const schema_1 = require("./schema");
exports.key = new prosemirror_state_1.PluginKey("selectingCells");
function cellAround($pos) {
    for (let d = $pos.depth - 1; d > 0; d--)
        if ($pos.node(d).type.spec.tableRole == "row")
            return $pos.node(0).resolve($pos.before(d + 1));
    return null;
}
exports.cellAround = cellAround;
function cellWrapping($pos) {
    for (let d = $pos.depth; d > 0; d--) {
        const role = $pos.node(d).type.spec.tableRole;
        if (role === "cell" || role === 'tableheader')
            return $pos.node(d);
    }
    return null;
}
exports.cellWrapping = cellWrapping;
function isInTable(state) {
    let $head = state.selection.$head;
    for (let d = $head.depth; d > 0; d--)
        if ($head.node(d).type.spec.tableRole == "row")
            return true;
    return false;
}
exports.isInTable = isInTable;
function selectionCell(state) {
    let sel = state.selection;
    if (sel.$anchorCell) {
        return sel.$anchorCell.pos > sel.$headCell.pos ? sel.$anchorCell : sel.$headCell;
    }
    else if (sel.node && sel.node.type.spec.tableRole == "cell") {
        return sel.$anchor;
    }
    return cellAround(sel.$head) || cellNear(sel.$head);
}
exports.selectionCell = selectionCell;
function cellNear($pos) {
    for (let after = $pos.nodeAfter, pos = $pos.pos; after; after = after.firstChild, pos++) {
        let role = after.type.spec.tableRole;
        if (role == "cell" || role == "tableheader")
            return $pos.doc.resolve(pos);
    }
    for (let before = $pos.nodeBefore, pos = $pos.pos; before; before = before.lastChild, pos--) {
        let role = before.type.spec.tableRole;
        if (role == "cell" || role == "tableheader")
            return $pos.doc.resolve(pos - before.nodeSize);
    }
}
function pointsAtCell($pos) {
    return $pos.parent.type.spec.tableRole == "row" && $pos.nodeAfter;
}
exports.pointsAtCell = pointsAtCell;
function moveCellForward($pos) {
    return $pos.node(0).resolve($pos.pos + $pos.nodeAfter.nodeSize);
}
exports.moveCellForward = moveCellForward;
function inSameTable($a, $b) {
    return $a.depth == $b.depth && $a.pos >= $b.start(-1) && $a.pos <= $b.end(-1);
}
exports.inSameTable = inSameTable;
function findCell($pos) {
    return tablemap_1.TableMap.get($pos.node(-1)).findCell($pos.pos - $pos.start(-1));
}
exports.findCell = findCell;
function colCount($pos) {
    return tablemap_1.TableMap.get($pos.node(-1)).colCount($pos.pos - $pos.start(-1));
}
exports.colCount = colCount;
function nextCell($pos, axis, dir) {
    let start = $pos.start(-1), map = tablemap_1.TableMap.get($pos.node(-1));
    let moved = map.nextCell($pos.pos - start, axis, dir);
    return moved == null ? null : $pos.node(0).resolve(start + moved);
}
exports.nextCell = nextCell;
function setAttr(attrs, name, value) {
    let result = {};
    for (let prop in attrs)
        result[prop] = attrs[prop];
    result[name] = value;
    return result;
}
exports.setAttr = setAttr;
function removeColSpan(attrs, pos, n = 1) {
    let result = setAttr(attrs, "colspan", attrs.colspan - n);
    if (result.colwidth) {
        result.colwidth = result.colwidth.slice();
        result.colwidth.splice(pos, n);
        if (!result.colwidth.some(w => w > 0))
            result.colwidth = null;
    }
    return result;
}
exports.removeColSpan = removeColSpan;
function addColSpan(attrs, pos, n = 1) {
    let result = setAttr(attrs, "colspan", attrs.colspan + n);
    if (result.colwidth) {
        result.colwidth = result.colwidth.slice();
        for (let i = 0; i < n; i++)
            result.colwidth.splice(pos, 0, 0);
    }
    return result;
}
exports.addColSpan = addColSpan;
function columnIsHeader(map, table, col) {
    let headerCell = (0, schema_1.tableNodeTypes)(table.type.schema).tableheader;
    for (let row = 0; row < map.height; row++)
        if (table.nodeAt(map.map[col + row * map.width]).type != headerCell)
            return false;
    return true;
}
exports.columnIsHeader = columnIsHeader;
