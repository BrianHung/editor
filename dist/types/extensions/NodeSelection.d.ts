import type { EditorState } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import { NodeSelection } from "prosemirror-state";
declare type BlockSelection = NodeSelection & {
    block: true;
};
export declare function selectPrevNodeSelection(state: EditorState, dispatch: any, view: EditorView): boolean;
export declare function selectNextNodeSelection(state: EditorState, dispatch: any, view: EditorView): boolean;
export declare function findFirstChildNodeSelection(state: any): void;
export declare function findLastChildNodeSelection(state: any): void;
export declare function findPrevSiblingNodeSelection(state: EditorState): BlockSelection;
export declare function findNextSiblingNodeSelection(state: EditorState): BlockSelection;
export declare function selectParentNode(state: EditorState, dispatch: any, view: EditorView): boolean;
export {};
//# sourceMappingURL=NodeSelection.d.ts.map