import { setBlockType } from "prosemirror-commands";
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import Node from "../Node";

export default class Paragraph extends Node {

  get name() {
    return "paragraph";
  }

  get schema(): NodeSpec {
    return {
      content: "inline*",
      group: "block",
      parseDOM: [{tag: "p"}],
      toDOM() { return ["p", 0] },
    };
  }

  keys({nodeType}) {
    return {
      "Mod-Alt-0": setBlockType(nodeType),
    };
  }

  commands({nodeType}) {
    return () => setBlockType(nodeType);
  }
}