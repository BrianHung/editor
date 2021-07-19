import { NodeView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
export declare class TableView implements NodeView {
    node: PMNode;
    cellMinWidth: number;
    dom: HTMLElement;
    table: HTMLElement;
    colgroup: HTMLElement;
    contentDOM: HTMLElement;
    constructor(node: PMNode, cellMinWidth: number);
    update(node: any): boolean;
    ignoreMutation(record: any): boolean;
}
export declare function updateColumns(node: PMNode, colgroup: HTMLElement, table: HTMLElement, cellMinWidth: number, overrideCol?: number, overrideValue?: any): void;
//# sourceMappingURL=table-nodeview.d.ts.map