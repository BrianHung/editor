import Extension, { Command } from "../extensions/Extension";
import type { Mark as PMMark, MarkSpec, MarkType, Schema } from "prosemirror-model";
import type { NodeView, EditorView, Decoration } from "prosemirror-view";
import type { InputRule } from "prosemirror-inputrules";
export default abstract class Mark extends Extension {
    constructor(options?: Record<string, any>);
    get type(): "mark";
    abstract get name(): string;
    abstract get schema(): MarkSpec;
    keys?({ markType, schema }: {
        markType: MarkType;
        schema: Schema;
    }): Function | Record<string, Function>;
    inputRules?({ markType, schema }: {
        markType: MarkType;
        schema: Schema;
    }): InputRule[];
    commands({ markType, schema }: {
        markType: MarkType;
        schema: Schema;
    }): Record<string, Command> | Command;
    customNodeView?(props: CustomMarkViewProps): NodeView;
    get markdownToken(): string;
    get toMarkdown(): Record<string, any>;
    fromMarkdown(): {};
}
export declare type CustomMarkViewProps = {
    extension: Extension;
    node: PMMark;
    view: EditorView;
    getPos: boolean;
    decorations: Decoration[];
};
//# sourceMappingURL=Mark.d.ts.map