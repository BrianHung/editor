import Node from "../Node";
import type { NodeSpec } from "prosemirror-model";
export default class Embed extends Node {
    get name(): string;
    get schema(): NodeSpec;
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
}
//# sourceMappingURL=index.d.ts.map