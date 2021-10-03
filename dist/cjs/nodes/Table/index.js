"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableHeader = exports.TableCell = exports.TableRow = exports.Table = exports.__clipCells = exports.__insertCells = exports.__pastedCells = exports.TableView = exports.updateColumnsOnResize = exports.columnResizingPluginKey = exports.columnResizing = exports.TableEditingKey = exports.TableMap = exports.CellSelection = exports.tableNodeTypes = exports.tableNodes = exports.columnIsHeader = exports.addColSpan = exports.removeColSpan = exports.pointsAtCell = exports.setAttr = exports.nextCell = exports.colCount = exports.findCell = exports.inSameTable = exports.moveCellForward = exports.selectionCell = exports.isInTable = exports.cellAround = exports.FixTablesKey = exports.handlePaste = exports.fixTables = exports.tableEditing = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const input_1 = require("./input");
Object.defineProperty(exports, "handlePaste", { enumerable: true, get: function () { return input_1.handlePaste; } });
const util_1 = require("./util");
Object.defineProperty(exports, "TableEditingKey", { enumerable: true, get: function () { return util_1.key; } });
const cellselection_1 = require("./cellselection");
const fixtables_1 = require("./fixtables");
Object.defineProperty(exports, "fixTables", { enumerable: true, get: function () { return fixtables_1.fixTables; } });
Object.defineProperty(exports, "FixTablesKey", { enumerable: true, get: function () { return fixtables_1.FixTablesKey; } });
function tableEditing({ allowTableNodeSelection = false } = {}) {
    return new prosemirror_state_1.Plugin({
        key: util_1.key,
        state: {
            init() { return null; },
            apply(tr, cur) {
                let set = tr.getMeta(util_1.key);
                if (set != null)
                    return set == -1 ? null : set;
                if (cur == null || !tr.docChanged)
                    return cur;
                let { deleted, pos } = tr.mapping.mapResult(cur);
                return deleted ? null : pos;
            }
        },
        props: {
            decorations: cellselection_1.drawCellSelection,
            handleDOMEvents: {
                mousedown: input_1.handleMouseDown
            },
            createSelectionBetween(view) {
                if (util_1.key.getState(view.state) != null)
                    return view.state.selection;
            },
            handleTripleClick: input_1.handleTripleClick,
            handleKeyDown: input_1.handleKeyDown,
            handlePaste: input_1.handlePaste
        },
        appendTransaction(_, oldState, state) {
            return (0, cellselection_1.normalizeSelection)(state, (0, fixtables_1.fixTables)(state, oldState), allowTableNodeSelection);
        }
    });
}
exports.tableEditing = tableEditing;
var util_2 = require("./util");
Object.defineProperty(exports, "cellAround", { enumerable: true, get: function () { return util_2.cellAround; } });
Object.defineProperty(exports, "isInTable", { enumerable: true, get: function () { return util_2.isInTable; } });
Object.defineProperty(exports, "selectionCell", { enumerable: true, get: function () { return util_2.selectionCell; } });
Object.defineProperty(exports, "moveCellForward", { enumerable: true, get: function () { return util_2.moveCellForward; } });
Object.defineProperty(exports, "inSameTable", { enumerable: true, get: function () { return util_2.inSameTable; } });
Object.defineProperty(exports, "findCell", { enumerable: true, get: function () { return util_2.findCell; } });
Object.defineProperty(exports, "colCount", { enumerable: true, get: function () { return util_2.colCount; } });
Object.defineProperty(exports, "nextCell", { enumerable: true, get: function () { return util_2.nextCell; } });
Object.defineProperty(exports, "setAttr", { enumerable: true, get: function () { return util_2.setAttr; } });
Object.defineProperty(exports, "pointsAtCell", { enumerable: true, get: function () { return util_2.pointsAtCell; } });
Object.defineProperty(exports, "removeColSpan", { enumerable: true, get: function () { return util_2.removeColSpan; } });
Object.defineProperty(exports, "addColSpan", { enumerable: true, get: function () { return util_2.addColSpan; } });
Object.defineProperty(exports, "columnIsHeader", { enumerable: true, get: function () { return util_2.columnIsHeader; } });
var schema_1 = require("./schema");
Object.defineProperty(exports, "tableNodes", { enumerable: true, get: function () { return schema_1.tableNodes; } });
Object.defineProperty(exports, "tableNodeTypes", { enumerable: true, get: function () { return schema_1.tableNodeTypes; } });
var cellselection_2 = require("./cellselection");
Object.defineProperty(exports, "CellSelection", { enumerable: true, get: function () { return cellselection_2.CellSelection; } });
var tablemap_1 = require("./tablemap");
Object.defineProperty(exports, "TableMap", { enumerable: true, get: function () { return tablemap_1.TableMap; } });
__exportStar(require("./commands.js"), exports);
var columnresizing_1 = require("./columnresizing");
Object.defineProperty(exports, "columnResizing", { enumerable: true, get: function () { return columnresizing_1.columnResizing; } });
Object.defineProperty(exports, "columnResizingPluginKey", { enumerable: true, get: function () { return columnresizing_1.key; } });
var table_nodeview_js_1 = require("./table-nodeview.js");
Object.defineProperty(exports, "updateColumnsOnResize", { enumerable: true, get: function () { return table_nodeview_js_1.updateColumns; } });
Object.defineProperty(exports, "TableView", { enumerable: true, get: function () { return table_nodeview_js_1.TableView; } });
var copypaste_1 = require("./copypaste");
Object.defineProperty(exports, "__pastedCells", { enumerable: true, get: function () { return copypaste_1.pastedCells; } });
Object.defineProperty(exports, "__insertCells", { enumerable: true, get: function () { return copypaste_1.insertCells; } });
Object.defineProperty(exports, "__clipCells", { enumerable: true, get: function () { return copypaste_1.clipCells; } });
const Node_js_1 = require("../../Node.js");
const Table = (options) => (0, Node_js_1.Node)(Object.assign({ name: 'table', content: 'tablerow+', tableRole: 'table', isolating: true, group: 'block', parseDOM: [{ tag: 'table' }], toDOM() { return ['table', ['tbody', 0]]; } }, options));
exports.Table = Table;
const TableRow = (options) => (0, Node_js_1.Node)(Object.assign({ name: 'tablerow', content: '(tablecell|tableheader)*', tableRole: 'tablerow', parseDOM: [{ tag: 'tr' }], toDOM() { return ['tr', 0]; } }, options));
exports.TableRow = TableRow;
const TableCell = (options) => (0, Node_js_1.Node)(Object.assign({ name: 'tablecell', attrs: { colspan: { default: 1 }, rowspan: { default: 1 }, colwidth: { default: null } }, content: 'block+', tableRole: 'tablecell', isolating: true, parseDOM: [{ tag: 'td', getAttrs: (dom) => {
                let widthAttr = dom.getAttribute('data-colwidth');
                let widths = widthAttr && /^\d+(,\d+)*$/.test(widthAttr) ? widthAttr.split(",").map(s => Number(s)) : null;
                let colspan = Number(dom.getAttribute('colspan') || 1);
                let rowspan = Number(dom.getAttribute('rowspan') || 1);
                return {
                    colspan, rowspan, colwidth: widths && widths.length == colspan ? widths : null
                };
            } }], toDOM(node) { return ['td', Object.assign({}, node.attrs), 0]; } }, options));
exports.TableCell = TableCell;
const TableHeader = (options) => (0, Node_js_1.Node)(Object.assign({ name: 'tableheader', attrs: { colspan: { default: 1 }, rowspan: { default: 1 }, colwidth: { default: null } }, content: 'block+', tableRole: 'tableheader', isolating: true, parseDOM: [{ tag: 'th', getAttrs: (dom) => {
                let widthAttr = dom.getAttribute('data-colwidth');
                let widths = widthAttr && /^\d+(,\d+)*$/.test(widthAttr) ? widthAttr.split(",").map(s => Number(s)) : null;
                let colspan = Number(dom.getAttribute('colspan') || 1);
                let rowspan = Number(dom.getAttribute('rowspan') || 1);
                return {
                    colspan, rowspan, colwidth: widths && widths.length == colspan ? widths : null
                };
            } }], toDOM(node) { return ['th', Object.assign({}, node.attrs), 0]; } }, options));
exports.TableHeader = TableHeader;
