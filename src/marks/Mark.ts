import { toggleMark } from "prosemirror-commands";
import Extension, { Command } from "../extensions/Extension";
import type { Mark as PMMark, MarkSpec, MarkType, Schema } from "prosemirror-model";
import type { NodeView, EditorView, Decoration } from "prosemirror-view";
import type { InputRule } from "prosemirror-inputrules"
/**
 * Abstract class for implementing new ProseMirror marks.
 * See: https://prosemirror.net/docs/ref/#model.Mark
 */
export default abstract class Mark extends Extension {
  constructor(options?: Record<string, any>) {
    super(options);
  }
  get type() {
    return "mark" as const;
  }

  abstract get name(): string;

  abstract get schema(): MarkSpec;

  keys?({markType, schema}: {markType: MarkType, schema: Schema}): Function | Record<string, Function>;

  inputRules?({markType, schema}: {markType: MarkType, schema: Schema}): InputRule[];

  commands({markType, schema}: {markType: MarkType, schema: Schema}) : Record<string, Command> | Command {
    return () => toggleMark(markType);
  }

  customNodeView?(props: CustomMarkViewProps): NodeView;

  get markdownToken(): string {
    return "";
  }

  get toMarkdown(): Record<string, any> {
    return {};
  }

  fromMarkdown() {
    return {};
  }
}

export type CustomMarkViewProps = {
  extension: Extension;
  node: PMMark;
  view: EditorView;
  getPos: boolean;
  decorations: Decoration[];
}