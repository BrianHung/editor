import type { MarkdownSerializerState } from "prosemirror-markdown";
import type { Node as PMNode, NodeSpec, NodeType, Schema } from "prosemirror-model";
import type { NodeView, EditorView, Decoration } from "prosemirror-view";
import Extension, { Command } from "../extensions/Extension";
import type { InputRule } from "prosemirror-inputrules"

/**
 * Abstract class for implementing new ProseMirror nodes.
 * See: https://prosemirror.net/docs/ref/#model.Node
 */
export default abstract class Node extends Extension {

  constructor (options?: Record<string, any>) {
    super(options);
  }

  get type() {
    return "node" as const;
  }

  abstract get name(): string;

  abstract get schema(): NodeSpec;

  keys?({nodeType, schema}: {nodeType: NodeType, schema: Schema}): Function | Record<string, Function>;

  inputRules?({nodeType, schema}: {nodeType: NodeType, schema: Schema}): InputRule[];

  commands?({nodeType, schema}: {nodeType: NodeType, schema: Schema}): Record<string, Command> | Command;

  customNodeView?(props: CustomNodeViewProps): NodeView;
}

export type CustomNodeViewProps = {
  extension: Extension;
  node: PMNode;
  view: EditorView;
  getPos: () => number;
  decorations: Decoration[];
}