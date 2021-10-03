import { Node as PMNode } from "prosemirror-model";
import { Selection } from "prosemirror-state";
import { DecorationSet } from "prosemirror-view";
import { ResolvedPos, Slice } from "prosemirror-model";
export declare class MultiNodeSelection extends Selection<any> {
    anchors: ResolvedPos[];
    nodes: PMNode[];
    constructor(anchors: ResolvedPos[]);
    map(doc: any, mapping: any): Selection<any> | MultiNodeSelection;
    content(): Slice<any>;
    replace(tr: any, content?: Slice<any>): void;
    replaceWith(tr: any, node: any): void;
    forEachNode(f: any): void;
    eq(other: MultiNodeSelection): boolean;
    toJSON(): {
        type: string;
        anchors: ResolvedPos<any>[];
    };
    static fromJSON(doc: any, json: any): MultiNodeSelection;
    static create(doc: any, anchors: any): MultiNodeSelection;
    getBookmark(): MultiNodeBookmark;
}
declare class MultiNodeBookmark {
    anchors: Number[];
    constructor(anchors: any);
    map(mapping: any): MultiNodeBookmark;
    resolve(doc: any): void;
}
export declare function drawMultiNodeSelection(state: any): DecorationSet<any>;
export {};
//# sourceMappingURL=MultiNodeSelection.d.ts.map