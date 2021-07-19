import Node from '../Node';
import type { NodeSpec } from "prosemirror-model";
export default class EnumList extends Node {
    get name(): string;
    get schema(): NodeSpec;
    commands({ nodeType }: {
        nodeType: any;
    }): () => (state: any, dispatch: any) => boolean;
    keys({ nodeType }: {
        nodeType: any;
    }): {
        'Shift-Ctrl-1': (state: any, dispatch: any) => boolean;
    };
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
}
//# sourceMappingURL=index.d.ts.map