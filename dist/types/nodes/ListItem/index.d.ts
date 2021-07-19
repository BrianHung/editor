import Node from '../Node';
import type { NodeSpec } from "prosemirror-model";
export default class ListItem extends Node {
    get name(): string;
    get schema(): NodeSpec;
    keys({ nodeType }: {
        nodeType: any;
    }): {
        Enter: (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        Tab: (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        'Shift-Tab': (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        'Shift-Enter': (state: any, dispatch: any) => boolean;
        "Mod-[": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        "Mod-]": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    };
}
//# sourceMappingURL=index.d.ts.map