import Node from "../Node";
import type { NodeSpec } from "prosemirror-model";
export default class Image extends Node {
    get name(): string;
    get schema(): NodeSpec;
    commands({ nodeType }: {
        nodeType: any;
    }): (attrs: any) => (state: any, dispatch: any) => void;
    get plugins(): any[];
}
//# sourceMappingURL=index.d.ts.map