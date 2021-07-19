import Node from '../Node';
import { lineIndent, lineUndent, newLine, backspaceCodeBlock, toggleLineNumbers } from "./keymaps";
import type { NodeSpec } from "prosemirror-model";
import { Plugin } from "prosemirror-state";
export default class CodeBlock extends Node {
    get name(): string;
    get schema(): NodeSpec;
    commands({ nodeType, schema }: {
        nodeType: any;
        schema: any;
    }): () => (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    keys({ nodeType }: {
        nodeType: any;
    }): {
        "Shift-Ctrl-\\": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        Tab: typeof lineIndent;
        "Shift-Tab": typeof lineUndent;
        Enter: typeof newLine;
        "Ctrl-l": typeof toggleLineNumbers;
        Backspace: typeof backspaceCodeBlock;
    };
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    get plugins(): Plugin<any, any>[];
}
//# sourceMappingURL=index.d.ts.map