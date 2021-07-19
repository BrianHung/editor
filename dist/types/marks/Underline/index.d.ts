import Mark from '../Mark';
import type { MarkSpec } from "prosemirror-model";
export default class Underline extends Mark {
    get name(): string;
    get schema(): MarkSpec;
    inputRules({ markType }: {
        markType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    keys({ markType }: {
        markType: any;
    }): {
        'Mod-u': (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        'Mod-U': (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    };
}
//# sourceMappingURL=index.d.ts.map