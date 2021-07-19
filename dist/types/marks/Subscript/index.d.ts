import Mark from '../Mark';
import type { MarkSpec } from "prosemirror-model";
export default class Subscript extends Mark {
    get name(): string;
    get schema(): MarkSpec;
    keys({ markType }: {
        markType: any;
    }): {
        'Mod-,': (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    };
}
//# sourceMappingURL=index.d.ts.map