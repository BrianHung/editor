"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertCells = exports.clipCells = exports.fitSlice = exports.pastedCells = void 0;
const prosemirror_model_1 = require("prosemirror-model");
const prosemirror_transform_1 = require("prosemirror-transform");
const util_1 = require("./util");
const tablemap_1 = require("./tablemap");
const cellselection_1 = require("./cellselection");
const schema_1 = require("./schema");
function pastedCells(slice) {
    if (!slice.size)
        return null;
    let { content, openStart, openEnd } = slice;
    while (content.childCount == 1 && (openStart > 0 && openEnd > 0 || content.firstChild.type.spec.tableRole == "table")) {
        openStart--;
        openEnd--;
        content = content.firstChild.content;
    }
    let first = content.firstChild, role = first.type.spec.tableRole;
    let schema = first.type.schema, rows = [];
    if (role == "row") {
        for (let i = 0; i < content.childCount; i++) {
            let cells = content.child(i).content;
            let left = i ? 0 : Math.max(0, openStart - 1);
            let right = i < content.childCount - 1 ? 0 : Math.max(0, openEnd - 1);
            if (left || right)
                cells = fitSlice(schema_1.tableNodeTypes(schema).row, new prosemirror_model_1.Slice(cells, left, right)).content;
            rows.push(cells);
        }
    }
    else if (role == "cell" || role == "tableheader") {
        rows.push(openStart || openEnd ? fitSlice(schema_1.tableNodeTypes(schema).row, new prosemirror_model_1.Slice(content, openStart, openEnd)).content : content);
    }
    else {
        return null;
    }
    return ensureRectangular(schema, rows);
}
exports.pastedCells = pastedCells;
function ensureRectangular(schema, rows) {
    let widths = [];
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        for (let j = row.childCount - 1; j >= 0; j--) {
            let { rowspan, colspan } = row.child(j).attrs;
            for (let r = i; r < i + rowspan; r++)
                widths[r] = (widths[r] || 0) + colspan;
        }
    }
    let width = 0;
    for (let r = 0; r < widths.length; r++)
        width = Math.max(width, widths[r]);
    for (let r = 0; r < widths.length; r++) {
        if (r >= rows.length)
            rows.push(prosemirror_model_1.Fragment.empty);
        if (widths[r] < width) {
            let empty = schema_1.tableNodeTypes(schema).tablecell.createAndFill(), cells = [];
            for (let i = widths[r]; i < width; i++)
                cells.push(empty);
            rows[r] = rows[r].append(prosemirror_model_1.Fragment.from(cells));
        }
    }
    return { height: rows.length, width, rows };
}
function fitSlice(nodeType, slice) {
    let node = nodeType.createAndFill();
    let tr = new prosemirror_transform_1.Transform(node).replace(0, node.content.size, slice);
    return tr.doc;
}
exports.fitSlice = fitSlice;
function clipCells({ width, height, rows }, newWidth, newHeight) {
    if (width != newWidth) {
        let added = [], newRows = [];
        for (let row = 0; row < rows.length; row++) {
            let frag = rows[row], cells = [];
            for (let col = added[row] || 0, i = 0; col < newWidth; i++) {
                let cell = frag.child(i % frag.childCount);
                if (col + cell.attrs.colspan > newWidth)
                    cell = cell.type.create(util_1.removeColSpan(cell.attrs, cell.attrs.colspan, col + cell.attrs.colspan - newWidth), cell.content);
                cells.push(cell);
                col += cell.attrs.colspan;
                for (let j = 1; j < cell.attrs.rowspan; j++)
                    added[row + j] = (added[row + j] || 0) + cell.attrs.colspan;
            }
            newRows.push(prosemirror_model_1.Fragment.from(cells));
        }
        rows = newRows;
        width = newWidth;
    }
    if (height != newHeight) {
        let newRows = [];
        for (let row = 0, i = 0; row < newHeight; row++, i++) {
            let cells = [], source = rows[i % height];
            for (let j = 0; j < source.childCount; j++) {
                let cell = source.child(j);
                if (row + cell.attrs.rowspan > newHeight)
                    cell = cell.type.create(util_1.setAttr(cell.attrs, "rowspan", Math.max(1, newHeight - cell.attrs.rowspan)), cell.content);
                cells.push(cell);
            }
            newRows.push(prosemirror_model_1.Fragment.from(cells));
        }
        rows = newRows;
        height = newHeight;
    }
    return { width, height, rows };
}
exports.clipCells = clipCells;
function growTable(tr, map, table, start, width, height, mapFrom) {
    let schema = tr.doc.type.schema, types = schema_1.tableNodeTypes(schema), empty, emptyHead;
    if (width > map.width) {
        for (let row = 0, rowEnd = 0; row < map.height; row++) {
            let rowNode = table.child(row);
            rowEnd += rowNode.nodeSize;
            let cells = [], add;
            if (rowNode.lastChild == null || rowNode.lastChild.type == types.tablecell)
                add = empty || (empty = types.tablecell.createAndFill());
            else
                add = emptyHead || (emptyHead = types.tableheader.createAndFill());
            for (let i = map.width; i < width; i++)
                cells.push(add);
            tr.insert(tr.mapping.slice(mapFrom).map(rowEnd - 1 + start), cells);
        }
    }
    if (height > map.height) {
        let cells = [];
        for (let i = 0, start = (map.height - 1) * map.width; i < Math.max(map.width, width); i++) {
            let header = i >= map.width ? false :
                table.nodeAt(map.map[start + i]).type == types.tableheader;
            cells.push(header
                ? (emptyHead || (emptyHead = types.tableheader.createAndFill()))
                : (empty || (empty = types.tablecell.createAndFill())));
        }
        let emptyRow = types.row.create(null, prosemirror_model_1.Fragment.from(cells)), rows = [];
        for (let i = map.height; i < height; i++)
            rows.push(emptyRow);
        tr.insert(tr.mapping.slice(mapFrom).map(start + table.nodeSize - 2), rows);
    }
    return !!(empty || emptyHead);
}
function isolateHorizontal(tr, map, table, start, left, right, top, mapFrom) {
    if (top == 0 || top == map.height)
        return false;
    let found = false;
    for (let col = left; col < right; col++) {
        let index = top * map.width + col, pos = map.map[index];
        if (map.map[index - map.width] == pos) {
            found = true;
            let cell = table.nodeAt(pos);
            let { top: cellTop, left: cellLeft } = map.findCell(pos);
            tr.setNodeMarkup(tr.mapping.slice(mapFrom).map(pos + start), null, util_1.setAttr(cell.attrs, "rowspan", top - cellTop));
            tr.insert(tr.mapping.slice(mapFrom).map(map.positionAt(top, cellLeft, table)), cell.type.createAndFill(util_1.setAttr(cell.attrs, "rowspan", (cellTop + cell.attrs.rowspan) - top)));
            col += cell.attrs.colspan - 1;
        }
    }
    return found;
}
function isolateVertical(tr, map, table, start, top, bottom, left, mapFrom) {
    if (left == 0 || left == map.width)
        return false;
    let found = false;
    for (let row = top; row < bottom; row++) {
        let index = row * map.width + left, pos = map.map[index];
        if (map.map[index - 1] == pos) {
            found = true;
            let cell = table.nodeAt(pos), cellLeft = map.colCount(pos);
            let updatePos = tr.mapping.slice(mapFrom).map(pos + start);
            tr.setNodeMarkup(updatePos, null, util_1.removeColSpan(cell.attrs, left - cellLeft, cell.attrs.colspan - (left - cellLeft)));
            tr.insert(updatePos + cell.nodeSize, cell.type.createAndFill(util_1.removeColSpan(cell.attrs, 0, left - cellLeft)));
            row += cell.attrs.rowspan - 1;
        }
    }
    return found;
}
function insertCells(state, dispatch, tableStart, rect, cells) {
    let table = tableStart ? state.doc.nodeAt(tableStart - 1) : state.doc, map = tablemap_1.TableMap.get(table);
    let { top, left } = rect;
    let right = left + cells.width, bottom = top + cells.height;
    let tr = state.tr, mapFrom = 0;
    function recomp() {
        table = tableStart ? tr.doc.nodeAt(tableStart - 1) : tr.doc;
        map = tablemap_1.TableMap.get(table);
        mapFrom = tr.mapping.maps.length;
    }
    if (growTable(tr, map, table, tableStart, right, bottom, mapFrom))
        recomp();
    if (isolateHorizontal(tr, map, table, tableStart, left, right, top, mapFrom))
        recomp();
    if (isolateHorizontal(tr, map, table, tableStart, left, right, bottom, mapFrom))
        recomp();
    if (isolateVertical(tr, map, table, tableStart, top, bottom, left, mapFrom))
        recomp();
    if (isolateVertical(tr, map, table, tableStart, top, bottom, right, mapFrom))
        recomp();
    for (let row = top; row < bottom; row++) {
        let from = map.positionAt(row, left, table), to = map.positionAt(row, right, table);
        tr.replace(tr.mapping.slice(mapFrom).map(from + tableStart), tr.mapping.slice(mapFrom).map(to + tableStart), new prosemirror_model_1.Slice(cells.rows[row - top], 0, 0));
    }
    recomp();
    tr.setSelection(new cellselection_1.CellSelection(tr.doc.resolve(tableStart + map.positionAt(top, left, table)), tr.doc.resolve(tableStart + map.positionAt(bottom - 1, right - 1, table))));
    dispatch(tr);
}
exports.insertCells = insertCells;
