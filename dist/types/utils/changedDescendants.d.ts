import type { Node as PMNode } from "prosemirror-model";
export declare function changedDescendants(old: PMNode, cur: PMNode, offset: number, f: (node: PMNode, pos: number) => void): void;
import type { Transaction } from "prosemirror-state";
export declare function changedNodes(tr: Transaction, f: (node: PMNode, pos: number) => void): void;
//# sourceMappingURL=changedDescendants.d.ts.map