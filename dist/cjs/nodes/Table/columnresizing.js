"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.columnResizing = exports.key = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
const util_js_1 = require("./util.js");
const tablemap_js_1 = require("./tablemap.js");
const table_nodeview_js_1 = require("./table-nodeview.js");
const schema_js_1 = require("./schema.js");
exports.key = new prosemirror_state_1.PluginKey("TableColumnResizing");
function columnResizing({ handleWidth = 5, cellMinWidth = 25, View = table_nodeview_js_1.TableView, lastColumnResizable = true } = {}) {
    let plugin = new prosemirror_state_1.Plugin({
        key: exports.key,
        state: {
            init(_, state) {
                this.spec.props.nodeViews[(0, schema_js_1.tableNodeTypes)(state.schema).table.name] =
                    (node, view) => new View(node, cellMinWidth, view);
                return new ResizeState(-1, false);
            },
            apply(tr, prev) {
                return prev.apply(tr);
            }
        },
        props: {
            attributes(state) {
                let pluginState = exports.key.getState(state);
                return pluginState.activeHandle > -1 ? { class: "resize-cursor" } : null;
            },
            handleDOMEvents: {
                mousemove(view, event) { handleMouseMove(view, event, handleWidth, cellMinWidth, lastColumnResizable); },
                mouseleave(view) { handleMouseLeave(view); },
                mousedown(view, event) { handleMouseDown(view, event, cellMinWidth); }
            },
            decorations(state) {
                let pluginState = exports.key.getState(state);
                if (pluginState.activeHandle > -1)
                    return handleDecorations(state, pluginState.activeHandle);
            },
            nodeViews: {}
        }
    });
    return plugin;
}
exports.columnResizing = columnResizing;
class ResizeState {
    constructor(activeHandle, dragging) {
        this.activeHandle = activeHandle;
        this.dragging = dragging;
    }
    apply(tr) {
        let state = this, action = tr.getMeta(exports.key);
        if (action && action.setHandle != null)
            return new ResizeState(action.setHandle, null);
        if (action && action.setDragging !== undefined)
            return new ResizeState(state.activeHandle, action.setDragging);
        if (state.activeHandle > -1 && tr.docChanged) {
            let handle = tr.mapping.map(state.activeHandle, -1);
            if (!(0, util_js_1.pointsAtCell)(tr.doc.resolve(handle)))
                handle = null;
            state = new ResizeState(handle, state.dragging);
        }
        return state;
    }
}
function handleMouseMove(view, event, handleWidth, cellMinWidth, lastColumnResizable) {
    let pluginState = exports.key.getState(view.state);
    if (!pluginState.dragging) {
        let target = domCellAround(event.target), cell = -1;
        if (target) {
            let { left, right } = target.getBoundingClientRect();
            if (event.clientX - left <= handleWidth)
                cell = edgeCell(view, event, "left");
            else if (right - event.clientX <= handleWidth)
                cell = edgeCell(view, event, "right");
        }
        if (cell != pluginState.activeHandle) {
            if (!lastColumnResizable && cell !== -1) {
                let $cell = view.state.doc.resolve(cell);
                let table = $cell.node(-1), map = tablemap_js_1.TableMap.get(table), start = $cell.start(-1);
                let col = map.colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan - 1;
                if (col == map.width - 1) {
                    return;
                }
            }
            updateHandle(view, cell);
        }
    }
}
function handleMouseLeave(view) {
    let pluginState = exports.key.getState(view.state);
    if (pluginState.activeHandle > -1 && !pluginState.dragging)
        updateHandle(view, -1);
}
function handleMouseDown(view, event, cellMinWidth) {
    let pluginState = exports.key.getState(view.state);
    if (pluginState.activeHandle == -1 || pluginState.dragging)
        return false;
    let cell = view.state.doc.nodeAt(pluginState.activeHandle);
    let width = currentColWidth(view, pluginState.activeHandle, cell.attrs);
    view.dispatch(view.state.tr.setMeta(exports.key, { setDragging: { startX: event.clientX, startWidth: width } }));
    function finish(event) {
        window.removeEventListener("mouseup", finish);
        window.removeEventListener("mousemove", move);
        let pluginState = exports.key.getState(view.state);
        if (pluginState.dragging) {
            updateColumnWidth(view, pluginState.activeHandle, draggedWidth(pluginState.dragging, event, cellMinWidth));
            view.dispatch(view.state.tr.setMeta(exports.key, { setDragging: null }));
        }
    }
    function move(event) {
        if (!event.which)
            return finish(event);
        let pluginState = exports.key.getState(view.state);
        let dragged = draggedWidth(pluginState.dragging, event, cellMinWidth);
        displayColumnWidth(view, pluginState.activeHandle, dragged, cellMinWidth);
    }
    window.addEventListener("mouseup", finish);
    window.addEventListener("mousemove", move);
    event.preventDefault();
    return true;
}
function currentColWidth(view, cellPos, { colspan, colwidth }) {
    let width = colwidth && colwidth[colwidth.length - 1];
    if (width)
        return width;
    let dom = view.domAtPos(cellPos);
    let node = dom.node.childNodes[dom.offset];
    let domWidth = node.offsetWidth, parts = colspan;
    if (colwidth)
        for (let i = 0; i < colspan; i++)
            if (colwidth[i]) {
                domWidth -= colwidth[i];
                parts--;
            }
    return domWidth / parts;
}
function domCellAround(target) {
    while (target && target.nodeName != "TD" && target.nodeName != "TH")
        target = target.classList.contains("ProseMirror") ? null : target.parentNode;
    return target;
}
function edgeCell(view, event, side) {
    let found = view.posAtCoords({ left: event.clientX, top: event.clientY });
    if (!found)
        return -1;
    let { pos } = found;
    let $cell = (0, util_js_1.cellAround)(view.state.doc.resolve(pos));
    if (!$cell)
        return -1;
    if (side == "right")
        return $cell.pos;
    let map = tablemap_js_1.TableMap.get($cell.node(-1)), start = $cell.start(-1);
    let index = map.map.indexOf($cell.pos - start);
    return index % map.width == 0 ? -1 : start + map.map[index - 1];
}
function draggedWidth(dragging, event, cellMinWidth) {
    let offset = event.clientX - dragging.startX;
    return Math.max(cellMinWidth, dragging.startWidth + offset);
}
function updateHandle(view, value) {
    view.dispatch(view.state.tr.setMeta(exports.key, { setHandle: value }));
}
function updateColumnWidth(view, cell, width) {
    let $cell = view.state.doc.resolve(cell);
    let table = $cell.node(-1), map = tablemap_js_1.TableMap.get(table), start = $cell.start(-1);
    let col = map.colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan - 1;
    let tr = view.state.tr;
    for (let row = 0; row < map.height; row++) {
        let mapIndex = row * map.width + col;
        if (row && map.map[mapIndex] == map.map[mapIndex - map.width])
            continue;
        let pos = map.map[mapIndex], { attrs } = table.nodeAt(pos);
        let index = attrs.colspan == 1 ? 0 : col - map.colCount(pos);
        if (attrs.colwidth && attrs.colwidth[index] == width)
            continue;
        let colwidth = attrs.colwidth ? attrs.colwidth.slice() : zeroes(attrs.colspan);
        colwidth[index] = width;
        tr.setNodeMarkup(start + pos, null, (0, util_js_1.setAttr)(attrs, "colwidth", colwidth));
    }
    if (tr.docChanged)
        view.dispatch(tr);
}
function displayColumnWidth(view, cell, width, cellMinWidth) {
    let $cell = view.state.doc.resolve(cell);
    let table = $cell.node(-1), start = $cell.start(-1);
    let col = tablemap_js_1.TableMap.get(table).colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan - 1;
    let dom = view.domAtPos($cell.start(-1)).node;
    while (dom.nodeName != "TABLE")
        dom = dom.parentNode;
    (0, table_nodeview_js_1.updateColumns)(table, dom.firstChild, dom, cellMinWidth, col, width);
}
function zeroes(n) {
    let result = [];
    for (let i = 0; i < n; i++)
        result.push(0);
    return result;
}
function handleDecorations(state, cell) {
    let decorations = [];
    let $cell = state.doc.resolve(cell);
    let table = $cell.node(-1), map = tablemap_js_1.TableMap.get(table), start = $cell.start(-1);
    let col = map.colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan;
    for (let row = 0; row < map.height; row++) {
        let index = col + row * map.width - 1;
        if ((col == map.width || map.map[index] != map.map[index + 1]) &&
            (row == 0 || map.map[index - 1] != map.map[index - 1 - map.width])) {
            let cellPos = map.map[index];
            let pos = start + cellPos + table.nodeAt(cellPos).nodeSize - 1;
            let dom = document.createElement("div");
            dom.className = "column-resize-handle";
            decorations.push(prosemirror_view_1.Decoration.widget(pos, dom));
        }
    }
    return prosemirror_view_1.DecorationSet.create(state.doc, decorations);
}
