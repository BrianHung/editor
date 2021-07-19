import Node from "../Node";
import type { NodeSpec } from "prosemirror-model";
export default class HardBreak extends Node {
    get name(): string;
    get schema(): NodeSpec;
    keys({ nodeType }: {
        nodeType: any;
    }): {
        'Mod-Enter': <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
        'Shift-Enter': <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
    };
}
//# sourceMappingURL=index.d.ts.map