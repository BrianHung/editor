import Node from './Node';
import type { NodeSpec } from "prosemirror-model";
export default class ToggleList extends Node {
    get name(): string;
    get schema(): NodeSpec;
    commands({ nodeType }: {
        nodeType: any;
    }): () => (state: any, dispatch: any) => boolean;
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
}
//# sourceMappingURL=ToggleList.d.ts.map