import Mark from '../Mark';
import { InputRule } from "prosemirror-inputrules";
import { Plugin } from "prosemirror-state";
import type { MarkSpec } from "prosemirror-model";
import { defaultOnClick } from "./utils";
export default class Link extends Mark {
    get name(): string;
    get defaultOptions(): {
        onClick: typeof defaultOnClick;
        onHover: any;
    };
    get schema(): MarkSpec;
    keys({ markType }: {
        markType: any;
    }): {
        "Mod-k": (state: EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        "Mod-K": (state: EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        "Alt-k": typeof openLinksAcrossTextSelection;
    };
    commands({ markType }: {
        markType: any;
    }): ({ href }?: {
        href: string;
    }) => (state: EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    inputRules({ markType }: {
        markType: any;
    }): InputRule<any>[];
    get plugins(): Plugin<any, any>[];
}
import type { EditorState } from "prosemirror-state";
declare function openLinksAcrossTextSelection(state: EditorState): boolean;
export {};
//# sourceMappingURL=index.d.ts.map