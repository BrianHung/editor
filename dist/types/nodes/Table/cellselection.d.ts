export function drawCellSelection(state: any): DecorationSet<any>;
export function normalizeSelection(state: any, tr: any, allowTableNodeSelection: any): any;
export class CellSelection extends Selection<any> {
    static colSelection($anchorCell: any, $headCell?: any): CellSelection;
    static rowSelection($anchorCell: any, $headCell?: any): CellSelection;
    static fromJSON(doc: any, json: any): CellSelection;
    static create(doc: any, anchorCell: any, headCell?: any): CellSelection;
    constructor($anchorCell: any, $headCell?: any);
    $anchorCell: any;
    $headCell: any;
    forEachCell(f: any): void;
    isColSelection(): boolean;
    isRowSelection(): boolean;
}
import { DecorationSet } from "prosemirror-view";
import { Selection } from "prosemirror-state";
//# sourceMappingURL=cellselection.d.ts.map