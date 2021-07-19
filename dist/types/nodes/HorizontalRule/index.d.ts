import Node from '../Node';
import type { NodeSpec } from "prosemirror-model";
import type { EditorState } from "prosemirror-state";
export default class HorizontalRule extends Node {
    get name(): string;
    get schema(): NodeSpec;
    commands({ nodeType }: {
        nodeType: any;
    }): (attrs: any) => (state: EditorState, dispatch: any) => any;
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
}
//# sourceMappingURL=index.d.ts.map