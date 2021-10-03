import { Plugin } from "prosemirror-state";
import { handlePaste } from "./input";
import { key as TableEditingKey } from "./util";
import { fixTables, FixTablesKey } from "./fixtables";
export declare function tableEditing({ allowTableNodeSelection }?: {
    allowTableNodeSelection?: boolean;
}): Plugin<any, any>;
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
export declare const Table: (options?: Partial<Node>) => Node;
export declare const TableRow: (options?: Partial<Node>) => Node;
export declare const TableCell: (options?: Partial<Node>) => Node;
export declare const TableHeader: (options?: Partial<Node>) => Node;
//# sourceMappingURL=index.d.ts.map