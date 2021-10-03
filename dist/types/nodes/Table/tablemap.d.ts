export class Rect {
    constructor(left: any, top: any, right: any, bottom: any);
    left: any;
    top: any;
    right: any;
    bottom: any;
}
export class TableMap {
    static get(table: any): any;
    constructor(width: any, height: any, map: any, problems: any);
    width: any;
    height: any;
    map: any;
    problems: any;
    findCell(pos: any): Rect;
    colCount(pos: any): number;
    nextCell(pos: any, axis: any, dir: any): any;
    rectBetween(a: any, b: any): Rect;
    cellsInRect(rect: any): any[];
    positionAt(row: any, col: any, table: any): any;
}
//# sourceMappingURL=tablemap.d.ts.map