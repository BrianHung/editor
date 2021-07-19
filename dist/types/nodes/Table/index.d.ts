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
export * from "./commands";
export { columnResizing, key as columnResizingPluginKey } from "./columnresizing";
export { updateColumns as updateColumnsOnResize, TableView } from "./table-nodeview";
export { pastedCells as __pastedCells, insertCells as __insertCells, clipCells as __clipCells } from "./copypaste";
import { NodeSpec } from "prosemirror-model";
import Node from "../Node";
export declare class Table extends Node {
    get name(): string;
    get schema(): NodeSpec;
}
export declare class TableRow extends Node {
    get name(): string;
    get schema(): NodeSpec;
}
export declare class TableCell extends Node {
    get name(): string;
    get schema(): NodeSpec;
}
export declare class TableHeader extends Node {
    get name(): string;
    get schema(): NodeSpec;
}
//# sourceMappingURL=index.d.ts.map