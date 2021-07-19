export function selectedRect(state: any): any;
export function addColumn(tr: any, { map, tableStart, table }: {
    map: any;
    tableStart: any;
    table: any;
}, col: any): any;
export function addColumnBefore(state: any, dispatch: any): boolean;
export function addColumnAfter(state: any, dispatch: any): boolean;
export function removeColumn(tr: any, { map, table, tableStart }: {
    map: any;
    table: any;
    tableStart: any;
}, col: any): void;
export function deleteColumn(state: any, dispatch: any): boolean;
export function rowIsHeader(map: any, table: any, row: any): boolean;
export function addRow(tr: any, { map, tableStart, table }: {
    map: any;
    tableStart: any;
    table: any;
}, row: any): any;
export function addRowBefore(state: any, dispatch: any): boolean;
export function addRowAfter(state: any, dispatch: any): boolean;
export function removeRow(tr: any, { map, table, tableStart }: {
    map: any;
    table: any;
    tableStart: any;
}, row: any): void;
export function deleteRow(state: any, dispatch: any): boolean;
export function mergeCells(state: any, dispatch: any): boolean;
export function splitCell(state: any, dispatch: any): boolean;
export function splitCellWithType(getCellType: any): (state: any, dispatch: any) => boolean;
export function setCellAttr(name: any, value: any): (state: any, dispatch: any) => boolean;
export function toggleHeader(type: any, options: any): (state: any, dispatch: any) => boolean;
export function goToNextCell(direction: any): (state: any, dispatch: any) => boolean;
export function deleteTable(state: any, dispatch: any): boolean;
export function toggleHeaderRow(state: any, dispatch: any): boolean;
export function toggleHeaderColumn(state: any, dispatch: any): boolean;
export function toggleHeaderCell(state: any, dispatch: any): boolean;
//# sourceMappingURL=commands.d.ts.map