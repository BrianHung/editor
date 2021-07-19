import Node, { CustomNodeViewProps } from '../Node';
import { deleteMathBlock } from "./keymaps";
import type { NodeSpec } from "prosemirror-model";
import MathBlockNodeView from "./mathblock-nodeview";
export default class MathBlock extends Node {
    get name(): string;
    get schema(): NodeSpec;
    commands({ nodeType, schema }: {
        nodeType: any;
        schema: any;
    }): () => (state: any, dispatch: any, view: any) => boolean;
    keys({ nodeType }: {
        nodeType: any;
    }): {
        Tab: (state: any, dispatch: any, view: any) => boolean;
        "Shift-Tab": (state: any, dispatch: any, view: any) => boolean;
        Enter: (state: any, dispatch: any, view: any) => boolean;
        Backspace: typeof deleteMathBlock;
    };
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    customNodeView(props: CustomNodeViewProps): MathBlockNodeView;
}
//# sourceMappingURL=index.d.ts.map