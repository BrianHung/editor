import type { EditorState } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
export declare function lineIndent(state: EditorState, dispatch: any, view: EditorView): boolean;
export declare function lineUndent(state: EditorState, dispatch: any, view: EditorView): boolean;
export declare function newLine(state: EditorState, dispatch: any, view: EditorView): boolean;
export declare function backspaceCodeBlock(state: EditorState, dispatch: any, view: EditorView): boolean;
export declare function deleteCodeBlock(state: EditorState, dispatch: any, view: EditorView): boolean;
export declare function toggleLineNumbers(state: EditorState, dispatch: any): boolean;
//# sourceMappingURL=keymaps.d.ts.map