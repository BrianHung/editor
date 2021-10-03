import type { Mark as PMMark, MarkSpec, MarkType, Schema } from "prosemirror-model";
import type { NodeView, EditorView } from "prosemirror-view";
import type { InputRule } from "prosemirror-inputrules";
import type { Plugin } from "prosemirror-state";
import type { Command, Keymap } from "prosemirror-commands";
export interface Mark extends MarkSpec {
    type: 'mark';
    name: string;
    markView?: (props: MarkViewProps) => NodeView;
    plugins?: (props?: {
        schema: Schema;
        markType: MarkType;
    }) => Plugin[];
    inputRules?: (props?: {
        schema: Schema;
        markType: MarkType;
    }) => InputRule[];
    commands?: (props?: {
        schema: Schema;
        markType: MarkType;
    }) => Record<string, (props: any) => Command>;
    keymap?: (props?: {
        schema: Schema;
        markType: MarkType;
        mac: boolean;
    }) => Keymap;
    [key: string]: any;
}
export declare type CustomMarkView = (mark: PMMark, view: EditorView, inline: boolean) => NodeView;
export interface MarkViewProps {
    mark: PMMark;
    view: EditorView;
    inline: boolean;
}
export declare const Mark: (options: Partial<Mark>) => Mark;
//# sourceMappingURL=Mark.d.ts.map