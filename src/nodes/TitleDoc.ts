import { NodeSpec } from "prosemirror-model";
import Node from "./Node";
export default class TitleDoc extends Node {
  get name() {
    return "titledoc"
  }
  get schema(): NodeSpec {
    return {
      content: "title block+",
    };
  }
}