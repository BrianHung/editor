import Node from '../Node';
import type { NodeSpec } from "prosemirror-model";
import { InputRule } from 'prosemirror-inputrules';
export default class ItemList extends Node {
    get name(): string;
    get schema(): NodeSpec;
    commands({ nodeType }: {
        nodeType: any;
    }): () => (state: any, dispatch: any) => boolean;
    keys({ nodeType }: {
        nodeType: any;
    }): {
        'Shift-Ctrl-2': (state: any, dispatch: any) => boolean;
    };
    inputRules({ nodeType }: {
        nodeType: any;
    }): InputRule<any>[];
}
//# sourceMappingURL=index.d.ts.map