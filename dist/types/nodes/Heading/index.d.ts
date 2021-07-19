import Node from "../Node";
import type { NodeSpec } from "prosemirror-model";
export default class Heading extends Node {
    get name(): string;
    get schema(): NodeSpec;
    commands({ nodeType, schema }: {
        nodeType: any;
        schema: any;
    }): (attrs: any) => (state: any, dispatch: any, view: any) => boolean;
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    keys({ nodeType }: {
        nodeType: any;
    }): {
        "Mod-Alt-1": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        "Mod-Alt-2": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        "Mod-Alt-3": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        "Mod-Alt-4": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        "Mod-Alt-5": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        "Mod-Alt-6": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    };
}
//# sourceMappingURL=index.d.ts.map