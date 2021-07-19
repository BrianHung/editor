import Mark from '../Mark';
import type { MarkSpec } from "prosemirror-model";
export default class Math extends Mark {
    get name(): string;
    get schema(): MarkSpec;
    get plugins(): import("prosemirror-state").Plugin<any, any>[];
}
//# sourceMappingURL=index.d.ts.map