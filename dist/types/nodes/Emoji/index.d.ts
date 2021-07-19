import Node from '../Node';
import type { NodeSpec } from "prosemirror-model";
import { InputRule } from 'prosemirror-inputrules';
import { Plugin } from "prosemirror-state";
export default class Emoji extends Node {
    get name(): string;
    get schema(): NodeSpec;
    inputRules({ nodeType }: {
        nodeType: any;
    }): InputRule<any>[];
    get plugins(): Plugin<any, any>[];
}
//# sourceMappingURL=index.d.ts.map