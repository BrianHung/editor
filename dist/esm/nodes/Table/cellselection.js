import { Selection, TextSelection, NodeSelection, SelectionRange } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Fragment, Slice } from "prosemirror-model";
import { inSameTable, pointsAtCell, setAttr, removeColSpan } from "./util";
import { TableMap } from "./tablemap";
export class CellSelection extends Selection {
    constructor($anchorCell, $headCell = $anchorCell) {
        let table = $anchorCell.node(-1), map = TableMap.get(table), start = $anchorCell.start(-1);
        let rect = map.rectBetween($anchorCell.pos - start, $headCell.pos - start);
        let doc = $anchorCell.node(0);
        let cells = map.cellsInRect(rect).filter(p => p != $headCell.pos - start);
        cells.unshift($headCell.pos - start);
        let ranges = cells.map(pos => {
            let cell = table.nodeAt(pos), from = pos + start + 1;
            return new SelectionRange(doc.resolve(from), doc.resolve(from + cell.content.size));
        });
        super(ranges[0].$from, ranges[0].$to, ranges);
        this.$anchorCell = $anchorCell;
        this.$headCell = $headCell;
    }
    map(doc, mapping) {
        let $anchorCell = doc.resolve(mapping.map(this.$anchorCell.pos));
        let $headCell = doc.resolve(mapping.map(this.$headCell.pos));
        if (pointsAtCell($anchorCell) && pointsAtCell($headCell) && inSameTable($anchorCell, $headCell)) {
            let tableChanged = this.$anchorCell.node(-1) != $anchorCell.node(-1);
            if (tableChanged && this.isRowSelection())
                return CellSelection.rowSelection($anchorCell, $headCell);
            else if (tableChanged && this.isColSelection())
                return CellSelection.colSelection($anchorCell, $headCell);
            else
                return new CellSelection($anchorCell, $headCell);
        }
        return TextSelection.between($anchorCell, $headCell);
    }
    content() {
        let table = this.$anchorCell.node(-1), map = TableMap.get(table), start = this.$anchorCell.start(-1);
        let rect = map.rectBetween(this.$anchorCell.pos - start, this.$headCell.pos - start);
        let seen = {}, rows = [];
        for (let row = rect.top; row < rect.bottom; row++) {
            let rowContent = [];
            for (let index = row * map.width + rect.left, col = rect.left; col < rect.right; col++, index++) {
                let pos = map.map[index];
                if (!seen[pos]) {
                    seen[pos] = true;
                    let cellRect = map.findCell(pos), cell = table.nodeAt(pos);
                    let extraLeft = rect.left - cellRect.left, extraRight = cellRect.right - rect.right;
                    if (extraLeft > 0 || extraRight > 0) {
                        let attrs = cell.attrs;
                        if (extraLeft > 0)
                            attrs = removeColSpan(attrs, 0, extraLeft);
                        if (extraRight > 0)
                            attrs = removeColSpan(attrs, attrs.colspan - extraRight, extraRight);
                        if (cellRect.left < rect.left)
                            cell = cell.type.createAndFill(attrs);
                        else
                            cell = cell.type.create(attrs, cell.content);
                    }
                    if (cellRect.top < rect.top || cellRect.bottom > rect.bottom) {
                        let attrs = setAttr(cell.attrs, "rowspan", Math.min(cellRect.bottom, rect.bottom) - Math.max(cellRect.top, rect.top));
                        if (cellRect.top < rect.top)
                            cell = cell.type.createAndFill(attrs);
                        else
                            cell = cell.type.create(attrs, cell.content);
                    }
                    rowContent.push(cell);
                }
            }
            rows.push(table.child(row).copy(Fragment.from(rowContent)));
        }
        const fragment = this.isColSelection() && this.isRowSelection() ? table : rows;
        return new Slice(Fragment.from(fragment), 1, 1);
    }
    replace(tr, content = Slice.empty) {
        let mapFrom = tr.steps.length, ranges = this.ranges;
        for (let i = 0; i < ranges.length; i++) {
            let { $from, $to } = ranges[i], mapping = tr.mapping.slice(mapFrom);
            tr.replace(mapping.map($from.pos), mapping.map($to.pos), i ? Slice.empty : content);
        }
        let sel = Selection.findFrom(tr.doc.resolve(tr.mapping.slice(mapFrom).map(this.to)), -1);
        if (sel)
            tr.setSelection(sel);
    }
    replaceWith(tr, node) {
        this.replace(tr, new Slice(Fragment.from(node), 0, 0));
    }
    forEachCell(f) {
        let table = this.$anchorCell.node(-1), map = TableMap.get(table), start = this.$anchorCell.start(-1);
        let cells = map.cellsInRect(map.rectBetween(this.$anchorCell.pos - start, this.$headCell.pos - start));
        for (let i = 0; i < cells.length; i++)
            f(table.nodeAt(cells[i]), start + cells[i]);
    }
    isColSelection() {
        let anchorTop = this.$anchorCell.index(-1), headTop = this.$headCell.index(-1);
        if (Math.min(anchorTop, headTop) > 0)
            return false;
        let anchorBot = anchorTop + this.$anchorCell.nodeAfter.attrs.rowspan, headBot = headTop + this.$headCell.nodeAfter.attrs.rowspan;
        return Math.max(anchorBot, headBot) == this.$headCell.node(-1).childCount;
    }
    static colSelection($anchorCell, $headCell = $anchorCell) {
        let map = TableMap.get($anchorCell.node(-1)), start = $anchorCell.start(-1);
        let anchorRect = map.findCell($anchorCell.pos - start), headRect = map.findCell($headCell.pos - start);
        let doc = $anchorCell.node(0);
        if (anchorRect.top <= headRect.top) {
            if (anchorRect.top > 0)
                $anchorCell = doc.resolve(start + map.map[anchorRect.left]);
            if (headRect.bottom < map.height)
                $headCell = doc.resolve(start + map.map[map.width * (map.height - 1) + headRect.right - 1]);
        }
        else {
            if (headRect.top > 0)
                $headCell = doc.resolve(start + map.map[headRect.left]);
            if (anchorRect.bottom < map.height)
                $anchorCell = doc.resolve(start + map.map[map.width * (map.height - 1) + anchorRect.right - 1]);
        }
        return new CellSelection($anchorCell, $headCell);
    }
    isRowSelection() {
        let map = TableMap.get(this.$anchorCell.node(-1)), start = this.$anchorCell.start(-1);
        let anchorLeft = map.colCount(this.$anchorCell.pos - start), headLeft = map.colCount(this.$headCell.pos - start);
        if (Math.min(anchorLeft, headLeft) > 0)
            return false;
        let anchorRight = anchorLeft + this.$anchorCell.nodeAfter.attrs.colspan, headRight = headLeft + this.$headCell.nodeAfter.attrs.colspan;
        return Math.max(anchorRight, headRight) == map.width;
    }
    eq(other) {
        return other instanceof CellSelection && other.$anchorCell.pos == this.$anchorCell.pos &&
            other.$headCell.pos == this.$headCell.pos;
    }
    static rowSelection($anchorCell, $headCell = $anchorCell) {
        let map = TableMap.get($anchorCell.node(-1)), start = $anchorCell.start(-1);
        let anchorRect = map.findCell($anchorCell.pos - start), headRect = map.findCell($headCell.pos - start);
        let doc = $anchorCell.node(0);
        if (anchorRect.left <= headRect.left) {
            if (anchorRect.left > 0)
                $anchorCell = doc.resolve(start + map.map[anchorRect.top * map.width]);
            if (headRect.right < map.width)
                $headCell = doc.resolve(start + map.map[map.width * (headRect.top + 1) - 1]);
        }
        else {
            if (headRect.left > 0)
                $headCell = doc.resolve(start + map.map[headRect.top * map.width]);
            if (anchorRect.right < map.width)
                $anchorCell = doc.resolve(start + map.map[map.width * (anchorRect.top + 1) - 1]);
        }
        return new CellSelection($anchorCell, $headCell);
    }
    toJSON() {
        return { type: "cell", anchor: this.$anchorCell.pos, head: this.$headCell.pos };
    }
    static fromJSON(doc, json) {
        return new CellSelection(doc.resolve(json.anchor), doc.resolve(json.head));
    }
    static create(doc, anchorCell, headCell = anchorCell) {
        return new CellSelection(doc.resolve(anchorCell), doc.resolve(headCell));
    }
    getBookmark() { return new CellBookmark(this.$anchorCell.pos, this.$headCell.pos); }
}
CellSelection.prototype.visible = false;
Selection.jsonID("cell", CellSelection);
class CellBookmark {
    constructor(anchor, head) {
        this.anchor = anchor;
        this.head = head;
    }
    map(mapping) {
        return new CellBookmark(mapping.map(this.anchor), mapping.map(this.head));
    }
    resolve(doc) {
        let $anchorCell = doc.resolve(this.anchor), $headCell = doc.resolve(this.head);
        if ($anchorCell.parent.type.spec.tableRole == "row" &&
            $headCell.parent.type.spec.tableRole == "row" &&
            $anchorCell.index() < $anchorCell.parent.childCount &&
            $headCell.index() < $headCell.parent.childCount &&
            inSameTable($anchorCell, $headCell))
            return new CellSelection($anchorCell, $headCell);
        else
            return Selection.near($headCell, 1);
    }
}
export function drawCellSelection(state) {
    if (!(state.selection instanceof CellSelection))
        return null;
    let cells = [];
    state.selection.forEachCell((node, pos) => {
        cells.push(Decoration.node(pos, pos + node.nodeSize, { class: "selectedCell" }));
    });
    return DecorationSet.create(state.doc, cells);
}
function isCellBoundarySelection({ $from, $to }) {
    if ($from.pos == $to.pos || $from.pos < $from.pos - 6)
        return false;
    let afterFrom = $from.pos, beforeTo = $to.pos, depth = $from.depth;
    for (; depth >= 0; depth--, afterFrom++)
        if ($from.after(depth + 1) < $from.end(depth))
            break;
    for (let d = $to.depth; d >= 0; d--, beforeTo--)
        if ($to.before(d + 1) > $to.start(d))
            break;
    return afterFrom == beforeTo && /row|table/.test($from.node(depth).type.spec.tableRole);
}
function isTextSelectionAcrossCells({ $from, $to }) {
    let fromCellBoundaryNode;
    let toCellBoundaryNode;
    for (let i = $from.depth; i > 0; i--) {
        let node = $from.node(i);
        if (node.type.spec.tableRole === 'cell' || node.type.spec.tableRole === 'tableheader') {
            fromCellBoundaryNode = node;
            break;
        }
    }
    for (let i = $to.depth; i > 0; i--) {
        let node = $to.node(i);
        if (node.type.spec.tableRole === 'cell' || node.type.spec.tableRole === 'tableheader') {
            toCellBoundaryNode = node;
            break;
        }
    }
    return fromCellBoundaryNode !== toCellBoundaryNode && $to.parentOffset === 0;
}
export function normalizeSelection(state, tr, allowTableNodeSelection) {
    let sel = (tr || state).selection, doc = (tr || state).doc, normalize, role;
    if (sel instanceof NodeSelection && (role = sel.node.type.spec.tableRole)) {
        if (role == "cell" || role == "tableheader") {
            normalize = CellSelection.create(doc, sel.from);
        }
        else if (role == "row") {
            let $cell = doc.resolve(sel.from + 1);
            normalize = CellSelection.rowSelection($cell, $cell);
        }
        else if (!allowTableNodeSelection) {
            let map = TableMap.get(sel.node), start = sel.from + 1;
            let lastCell = start + map.map[map.width * map.height - 1];
            normalize = CellSelection.create(doc, start + 1, lastCell);
        }
    }
    else if (sel instanceof TextSelection && isCellBoundarySelection(sel)) {
        normalize = TextSelection.create(doc, sel.from);
    }
    else if (sel instanceof TextSelection && isTextSelectionAcrossCells(sel)) {
        normalize = TextSelection.create(doc, sel.$from.start(), sel.$from.end());
    }
    if (normalize)
        (tr || (tr = state.tr)).setSelection(normalize);
    return tr;
}
