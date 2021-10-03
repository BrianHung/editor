// This file defines a plugin that handles the drawing of cell
// selections and the basic user interactions for creating and working
// with such selections. It also makes sure that, after each
// transaction, the shapes of tables are normalized to be rectangular
// and not contain overlapping cells.

import {Plugin} from "prosemirror-state"

import {handleTripleClick, handleKeyDown, handlePaste, handleMouseDown} from "./input"
import {key as TableEditingKey} from "./util"
import {drawCellSelection, normalizeSelection} from "./cellselection"
import {fixTables, FixTablesKey} from "./fixtables"

// :: () → Plugin
//
// Creates a [plugin](http://prosemirror.net/docs/ref/#state.Plugin)
// that, when added to an editor, enables cell-selection, handles
// cell-based copy/paste, and makes sure tables stay well-formed (each
// row has the same width, and cells don't overlap).
//
// You should probably put this plugin near the end of your array of
// plugins, since it handles mouse and arrow key events in tables
// rather broadly, and other plugins, like the gap cursor or the
// column-width dragging plugin, might want to get a turn first to
// perform more specific behavior.
export function tableEditing({ allowTableNodeSelection = false } = {}) {
  return new Plugin({
    
    key: TableEditingKey,

    // This piece of state is used to remember when a mouse-drag
    // cell-selection is happening, so that it can continue even as
    // transactions (which might move its anchor cell) come in.
    state: {
      init() { return null },
      apply(tr, cur) {
        let set = tr.getMeta(TableEditingKey)
        if (set != null) return set == -1 ? null : set
        if (cur == null || !tr.docChanged) return cur
        let {deleted, pos} = tr.mapping.mapResult(cur)
        return deleted ? null : pos
      }
    },

    props: {
      decorations: drawCellSelection,

      handleDOMEvents: {
        // @ts-ignore
        mousedown: handleMouseDown
      },

      createSelectionBetween(view) {
        if (TableEditingKey.getState(view.state) != null) return view.state.selection
      },

      handleTripleClick,

      handleKeyDown,

      handlePaste
    },

    appendTransaction(_, oldState, state) {
      return normalizeSelection(state, fixTables(state, oldState), allowTableNodeSelection)
    }
  })
}

export {fixTables, handlePaste, FixTablesKey}
export {cellAround, isInTable, selectionCell, moveCellForward, inSameTable, findCell, colCount, nextCell, setAttr, pointsAtCell, removeColSpan, addColSpan, columnIsHeader} from "./util";
export {tableNodes, tableNodeTypes} from "./schema"
export {CellSelection} from "./cellselection"
export {TableMap} from "./tablemap"
export {TableEditingKey};
export * from "./commands.js"
export {columnResizing, key as columnResizingPluginKey} from "./columnresizing"
export {updateColumns as updateColumnsOnResize, TableView} from "./table-nodeview.js"
export {pastedCells as __pastedCells, insertCells as __insertCells, clipCells as __clipCells} from "./copypaste"





import { Node } from "../../Node.js";

export const Table = (options?: Partial<Node>) => Node({
  name: 'table',
  
  content: 'tablerow+',
  tableRole: 'table',
  isolating: true,
  group: 'block',
  parseDOM: [{tag: 'table'}],
  toDOM() { return ['table', ['tbody', 0]] },

  ...options,
})

export const TableRow = (options?: Partial<Node>) => Node({
  name: 'tablerow',

  content: '(tablecell|tableheader)*',
  tableRole: 'tablerow',
  parseDOM: [{tag: 'tr'}],
  toDOM() { return ['tr', 0] },

  ...options,
})

export const TableCell = (options?: Partial<Node>) => Node({
  name: 'tablecell',

  attrs: { colspan: {default: 1}, rowspan: {default: 1}, colwidth: {default: null}},
  content: 'block+',
  tableRole: 'tablecell',
  isolating: true,
  parseDOM: [{tag: 'td', getAttrs: (dom: HTMLTableDataCellElement) => {
    let widthAttr = dom.getAttribute('data-colwidth');
    let widths = widthAttr && /^\d+(,\d+)*$/.test(widthAttr) ? widthAttr.split(",").map(s => Number(s)) : null;
    let colspan = Number(dom.getAttribute('colspan') || 1);
    let rowspan = Number(dom.getAttribute('rowspan') || 1);
    return {
      colspan, rowspan, colwidth: widths && widths.length == colspan ? widths : null
    }
  }}],
  toDOM(node) { return ['td', {...node.attrs}, 0]; },

  ...options,
})

export const TableHeader = (options?: Partial<Node>) => Node({
  name: 'tableheader',

  attrs: { colspan: {default: 1}, rowspan: {default: 1}, colwidth: {default: null}},
  content: 'block+',
  tableRole: 'tableheader',
  isolating: true,
  parseDOM: [{tag: 'th', getAttrs: (dom: HTMLTableHeaderCellElement) => {
    let widthAttr = dom.getAttribute('data-colwidth');
    let widths = widthAttr && /^\d+(,\d+)*$/.test(widthAttr) ? widthAttr.split(",").map(s => Number(s)) : null;
    let colspan = Number(dom.getAttribute('colspan') || 1);
    let rowspan = Number(dom.getAttribute('rowspan') || 1);
    return {
      colspan, rowspan, colwidth: widths && widths.length == colspan ? widths : null
    }
  }}],
  toDOM(node) { return ['th', {...node.attrs}, 0]; },

  ...options,
})