import { Plugin } from "prosemirror-state";
import { handleTripleClick, handleKeyDown, handlePaste, handleMouseDown } from "./input";
import { key as TableEditingKey } from "./util";
import { drawCellSelection, normalizeSelection } from "./cellselection";
import { fixTables, FixTablesKey } from "./fixtables";
export function tableEditing({ allowTableNodeSelection = false } = {}) {
    return new Plugin({
        key: TableEditingKey,
        state: {
            init() { return null; },
            apply(tr, cur) {
                let set = tr.getMeta(TableEditingKey);
                if (set != null)
                    return set == -1 ? null : set;
                if (cur == null || !tr.docChanged)
                    return cur;
                let { deleted, pos } = tr.mapping.mapResult(cur);
                return deleted ? null : pos;
            }
        },
        props: {
            decorations: drawCellSelection,
            handleDOMEvents: {
                mousedown: handleMouseDown
            },
            createSelectionBetween(view) {
                if (TableEditingKey.getState(view.state) != null)
                    return view.state.selection;
            },
            handleTripleClick,
            handleKeyDown,
            handlePaste
        },
        appendTransaction(_, oldState, state) {
            return normalizeSelection(state, fixTables(state, oldState), allowTableNodeSelection);
        }
    });
}
export { fixTables, handlePaste, FixTablesKey };
export { cellAround, isInTable, selectionCell, moveCellForward, inSameTable, findCell, colCount, nextCell, setAttr, pointsAtCell, removeColSpan, addColSpan, columnIsHeader } from "./util";
export { tableNodes, tableNodeTypes } from "./schema";
export { CellSelection } from "./cellselection";
export { TableMap } from "./tablemap";
export { TableEditingKey };
export * from "./commands.js";
export { columnResizing, key as columnResizingPluginKey } from "./columnresizing";
export { updateColumns as updateColumnsOnResize, TableView } from "./table-nodeview.js";
export { pastedCells as __pastedCells, insertCells as __insertCells, clipCells as __clipCells } from "./copypaste";
import { Node } from "../../Node.js";
export const Table = (options) => Node(Object.assign({ name: 'table', content: 'tablerow+', tableRole: 'table', isolating: true, group: 'block', parseDOM: [{ tag: 'table' }], toDOM() { return ['table', ['tbody', 0]]; } }, options));
export const TableRow = (options) => Node(Object.assign({ name: 'tablerow', content: '(tablecell|tableheader)*', tableRole: 'tablerow', parseDOM: [{ tag: 'tr' }], toDOM() { return ['tr', 0]; } }, options));
export const TableCell = (options) => Node(Object.assign({ name: 'tablecell', attrs: { colspan: { default: 1 }, rowspan: { default: 1 }, colwidth: { default: null } }, content: 'block+', tableRole: 'tablecell', isolating: true, parseDOM: [{ tag: 'td', getAttrs: (dom) => {
                let widthAttr = dom.getAttribute('data-colwidth');
                let widths = widthAttr && /^\d+(,\d+)*$/.test(widthAttr) ? widthAttr.split(",").map(s => Number(s)) : null;
                let colspan = Number(dom.getAttribute('colspan') || 1);
                let rowspan = Number(dom.getAttribute('rowspan') || 1);
                return {
                    colspan, rowspan, colwidth: widths && widths.length == colspan ? widths : null
                };
            } }], toDOM(node) { return ['td', Object.assign({}, node.attrs), 0]; } }, options));
export const TableHeader = (options) => Node(Object.assign({ name: 'tableheader', attrs: { colspan: { default: 1 }, rowspan: { default: 1 }, colwidth: { default: null } }, content: 'block+', tableRole: 'tableheader', isolating: true, parseDOM: [{ tag: 'th', getAttrs: (dom) => {
                let widthAttr = dom.getAttribute('data-colwidth');
                let widths = widthAttr && /^\d+(,\d+)*$/.test(widthAttr) ? widthAttr.split(",").map(s => Number(s)) : null;
                let colspan = Number(dom.getAttribute('colspan') || 1);
                let rowspan = Number(dom.getAttribute('rowspan') || 1);
                return {
                    colspan, rowspan, colwidth: widths && widths.length == colspan ? widths : null
                };
            } }], toDOM(node) { return ['th', Object.assign({}, node.attrs), 0]; } }, options));
