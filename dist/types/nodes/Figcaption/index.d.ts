import Node from '../Node';
import type { NodeSpec } from "prosemirror-model";
import { onEnterFigcaption, onBackspaceFigcaption } from "./keymaps";
export default class Figcaption extends Node {
    get name(): string;
    get schema(): NodeSpec;
    keys({ nodeType }: {
        nodeType: any;
    }): {
        Enter: typeof onEnterFigcaption;
        Backspace: typeof onBackspaceFigcaption;
    };
}
//# sourceMappingURL=index.d.ts.map