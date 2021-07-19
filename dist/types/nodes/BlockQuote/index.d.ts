import Node from "../Node";
import type { NodeSpec } from "prosemirror-model";
export default class BlockQuote extends Node {
    get name(): string;
    get schema(): NodeSpec;
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    commands({ nodeType }: {
        nodeType: any;
    }): {
        blockquote: () => (state: any, dispatch: any) => void;
        pullquote: () => (state: any, dispatch: any) => void;
    };
    keys({ nodeType }: {
        nodeType: any;
    }): {
        'Ctrl->': (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        'Ctrl-"': (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    };
}
//# sourceMappingURL=index.d.ts.map