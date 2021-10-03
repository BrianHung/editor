import type { InputRule } from "prosemirror-inputrules";
import type { Plugin } from "prosemirror-state";
import type { Schema } from "prosemirror-model";
import type { Command, Keymap } from "prosemirror-commands";
export interface ExtensionSpec {
    name?: string;
    plugins?: (props?: {
        schema: Schema;
    }) => Plugin[];
    inputRules?: (props?: {
        schema: Schema;
    }) => InputRule[];
    commands?: (props?: {
        schema: Schema;
    }) => Record<string, (props: any) => Command>;
    keymap?: (props?: {
        schema: Schema;
        mac: boolean;
    }) => Keymap;
}
export interface Extension extends ExtensionSpec {
    type: 'extension';
}
export declare const Extension: (options: ExtensionSpec) => Extension;
//# sourceMappingURL=Extension.d.ts.map