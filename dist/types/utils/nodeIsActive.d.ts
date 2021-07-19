export default function nodeIsActive(state: any, type: any, attrs?: {}): any;
export function findParentNode(predicate: any): ({ $from }: {
    $from: any;
}) => {
    pos: any;
    start: any;
    depth: any;
    node: any;
};
export function findParentNodeClosestToPos($pos: any, predicate: any): {
    pos: any;
    start: any;
    depth: any;
    node: any;
};
export function findSelectedNodeOfType(nodeType: any): (selection: any) => {
    node: import("prosemirror-model").Node<any>;
    pos: number;
    depth: number;
};
export function equalNodeType(nodeType: any, node: any): boolean;
//# sourceMappingURL=nodeIsActive.d.ts.map