"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMouseDown = exports.handlePaste = exports.handleTripleClick = exports.handleKeyDown = void 0;
const prosemirror_model_1 = require("prosemirror-model");
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_keymap_1 = require("prosemirror-keymap");
const util_1 = require("./util");
const cellselection_1 = require("./cellselection");
const tablemap_1 = require("./tablemap");
const copypaste_1 = require("./copypaste");
const schema_1 = require("./schema");
exports.handleKeyDown = (0, prosemirror_keymap_1.keydownHandler)({
    "ArrowLeft": arrow("horiz", -1),
    "ArrowRight": arrow("horiz", 1),
    "ArrowUp": arrow("vert", -1),
    "ArrowDown": arrow("vert", 1),
    "Shift-ArrowLeft": shiftArrow("horiz", -1),
    "Shift-ArrowRight": shiftArrow("horiz", 1),
    "Shift-ArrowUp": shiftArrow("vert", -1),
    "Shift-ArrowDown": shiftArrow("vert", 1),
    "Backspace": deleteCellSelection,
    "Mod-Backspace": deleteCellSelection,
    "Delete": deleteCellSelection,
    "Mod-Delete": deleteCellSelection
});
function maybeSetSelection(state, dispatch, selection) {
    if (selection.eq(state.selection))
        return false;
    if (dispatch)
        dispatch(state.tr.setSelection(selection).scrollIntoView());
    return true;
}
function arrow(axis, dir) {
    return (state, dispatch, view) => {
        let sel = state.selection;
        if (sel instanceof cellselection_1.CellSelection) {
            return maybeSetSelection(state, dispatch, prosemirror_state_1.Selection.near(sel.$headCell, dir));
        }
        if (axis != "horiz" && !sel.empty)
            return false;
        let end = atEndOfCell(view, axis, dir);
        if (end == null)
            return false;
        if (axis == "horiz") {
            return maybeSetSelection(state, dispatch, prosemirror_state_1.Selection.near(state.doc.resolve(sel.head + dir), dir));
        }
        else {
            let $cell = state.doc.resolve(end), $next = (0, util_1.nextCell)($cell, axis, dir), newSel;
            if ($next)
                newSel = prosemirror_state_1.Selection.near($next, 1);
            else if (dir < 0)
                newSel = prosemirror_state_1.Selection.near(state.doc.resolve($cell.before(-1)), -1);
            else
                newSel = prosemirror_state_1.Selection.near(state.doc.resolve($cell.after(-1)), 1);
            return maybeSetSelection(state, dispatch, newSel);
        }
    };
}
function shiftArrow(axis, dir) {
    return (state, dispatch, view) => {
        let sel = state.selection;
        if (!(sel instanceof cellselection_1.CellSelection)) {
            let end = atEndOfCell(view, axis, dir);
            if (end == null)
                return false;
            sel = new cellselection_1.CellSelection(state.doc.resolve(end));
        }
        let $head = (0, util_1.nextCell)(sel.$headCell, axis, dir);
        if (!$head)
            return false;
        return maybeSetSelection(state, dispatch, new cellselection_1.CellSelection(sel.$anchorCell, $head));
    };
}
function deleteCellSelection(state, dispatch) {
    let sel = state.selection;
    if (!(sel instanceof cellselection_1.CellSelection))
        return false;
    if (dispatch) {
        let tr = state.tr, baseContent = (0, schema_1.tableNodeTypes)(state.schema).tablecell.createAndFill().content;
        sel.forEachCell((cell, pos) => {
            if (!cell.content.eq(baseContent))
                tr.replace(tr.mapping.map(pos + 1), tr.mapping.map(pos + cell.nodeSize - 1), new prosemirror_model_1.Slice(baseContent, 0, 0));
        });
        if (tr.docChanged)
            dispatch(tr);
    }
    return true;
}
function handleTripleClick(view, pos) {
    let doc = view.state.doc, $cell = (0, util_1.cellAround)(doc.resolve(pos));
    if (!$cell)
        return false;
    view.dispatch(view.state.tr.setSelection(new cellselection_1.CellSelection($cell)));
    return true;
}
exports.handleTripleClick = handleTripleClick;
function handlePaste(view, _, slice) {
    if (!(0, util_1.isInTable)(view.state))
        return false;
    let cells = (0, copypaste_1.pastedCells)(slice), sel = view.state.selection;
    if (sel instanceof cellselection_1.CellSelection) {
        if (!cells)
            cells = { width: 1, height: 1, rows: [prosemirror_model_1.Fragment.from((0, copypaste_1.fitSlice)((0, schema_1.tableNodeTypes)(view.state.schema).tablecell, slice))] };
        let table = sel.$anchorCell.node(-1), start = sel.$anchorCell.start(-1);
        let rect = tablemap_1.TableMap.get(table).rectBetween(sel.$anchorCell.pos - start, sel.$headCell.pos - start);
        cells = (0, copypaste_1.clipCells)(cells, rect.right - rect.left, rect.bottom - rect.top);
        (0, copypaste_1.insertCells)(view.state, view.dispatch, start, rect, cells);
        return true;
    }
    else if (cells) {
        let $cell = (0, util_1.selectionCell)(view.state), start = $cell.start(-1);
        (0, copypaste_1.insertCells)(view.state, view.dispatch, start, tablemap_1.TableMap.get($cell.node(-1)).findCell($cell.pos - start), cells);
        return true;
    }
    else {
        return false;
    }
}
exports.handlePaste = handlePaste;
function handleMouseDown(view, startEvent) {
    if (startEvent.ctrlKey || startEvent.metaKey)
        return;
    let startDOMCell = domInCell(view, startEvent.target), $anchor;
    if (startEvent.shiftKey && (view.state.selection instanceof cellselection_1.CellSelection)) {
        setCellSelection(view.state.selection.$anchorCell, startEvent);
        startEvent.preventDefault();
    }
    else if (startEvent.shiftKey && startDOMCell &&
        ($anchor = (0, util_1.cellAround)(view.state.selection.$anchor)) != null &&
        cellUnderMouse(view, startEvent).pos != $anchor.pos) {
        setCellSelection($anchor, startEvent);
        startEvent.preventDefault();
    }
    else if (!startDOMCell) {
        return;
    }
    function setCellSelection($anchor, event) {
        let $head = cellUnderMouse(view, event);
        let starting = util_1.key.getState(view.state) == null;
        if (!$head || !(0, util_1.inSameTable)($anchor, $head)) {
            if (starting)
                $head = $anchor;
            else
                return;
        }
        let selection = new cellselection_1.CellSelection($anchor, $head);
        if (starting || !view.state.selection.eq(selection)) {
            let tr = view.state.tr.setSelection(selection);
            if (starting)
                tr.setMeta(util_1.key, $anchor.pos);
            view.dispatch(tr);
        }
    }
    function stop() {
        view.root.removeEventListener("mouseup", stop);
        view.root.removeEventListener("dragstart", stop);
        view.root.removeEventListener("mousemove", move);
        if (util_1.key.getState(view.state) != null)
            view.dispatch(view.state.tr.setMeta(util_1.key, -1));
    }
    function move(event) {
        let anchor = util_1.key.getState(view.state), $anchor;
        if (anchor != null) {
            $anchor = view.state.doc.resolve(anchor);
        }
        else if (domInCell(view, event.target) != startDOMCell) {
            $anchor = cellUnderMouse(view, startEvent);
            if (!$anchor)
                return stop();
        }
        if ($anchor)
            setCellSelection($anchor, event);
    }
    view.root.addEventListener("mouseup", stop);
    view.root.addEventListener("dragstart", stop);
    view.root.addEventListener("mousemove", move);
}
exports.handleMouseDown = handleMouseDown;
function atEndOfCell(view, axis, dir) {
    if (!(view.state.selection instanceof prosemirror_state_1.TextSelection))
        return null;
    let { $head } = view.state.selection;
    for (let d = $head.depth - 1; d >= 0; d--) {
        let parent = $head.node(d), index = dir < 0 ? $head.index(d) : $head.indexAfter(d);
        if (index != (dir < 0 ? 0 : parent.childCount))
            return null;
        if (parent.type.spec.tableRole == "cell" || parent.type.spec.tableRole == "tableheader") {
            let cellPos = $head.before(d);
            let dirStr = axis == "vert" ? (dir > 0 ? "down" : "up") : (dir > 0 ? "right" : "left");
            return view.endOfTextblock(dirStr) ? cellPos : null;
        }
    }
    return null;
}
function domInCell(view, dom) {
    for (; dom && dom != view.dom; dom = dom.parentNode)
        if (dom.nodeName == "TD" || dom.nodeName == "TH")
            return dom;
}
function cellUnderMouse(view, event) {
    let mousePos = view.posAtCoords({ left: event.clientX, top: event.clientY });
    if (!mousePos)
        return null;
    return mousePos ? (0, util_1.cellAround)(view.state.doc.resolve(mousePos.pos)) : null;
}
