import Node from '../Node';
import type { NodeSpec } from "prosemirror-model";
export default class TodoList extends Node {
    get name(): string;
    get schema(): NodeSpec;
    commands({ nodeType, schema }: {
        nodeType: any;
        schema: any;
    }): () => (state: any, dispatch: any) => boolean;
    keys({ nodeType }: {
        nodeType: any;
    }): {
        'Shift-Ctrl-3': (state: any, dispatch: any) => boolean;
    };
}
//# sourceMappingURL=index.d.ts.map