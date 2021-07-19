import Mark from './Mark';
import { Plugin } from "prosemirror-state";
import type { MarkSpec } from "prosemirror-model";
export default class Hashtag extends Mark {
    get name(): string;
    get defaultOptions(): {
        onClick: any;
    };
    get schema(): MarkSpec;
    get plugins(): Plugin<any, any>[];
}
//# sourceMappingURL=Hashtag.d.ts.map