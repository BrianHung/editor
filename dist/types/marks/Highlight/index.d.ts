import Mark from '../Mark';
import type { MarkSpec } from "prosemirror-model";
export default class Highlight extends Mark {
    get name(): string;
    get schema(): MarkSpec;
    keys({ markType }: {
        markType: any;
    }): {
        'Mod-h': (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        'Mod-H': (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    };
    inputRules({ markType }: {
        markType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
}
//# sourceMappingURL=index.d.ts.map