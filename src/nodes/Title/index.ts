import Node, { CustomNodeViewProps } from "../Node";
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import TitleNodeView from "./title-nodeview"

export default class Title extends Node {

  get name() {
    return "title"
  }

  get schema(): NodeSpec {
    return {
      content: "inline*",
      parseDOM: [{tag: "h1"}],
      toDOM: (node: PMNode) => ["h1", {class: "title"}, 0],
    };
  }

  get defaultOptions() {
    return {
      handleTitleChange: (title: string) => document.title = title || "Untitled"
    };
  }

  customNodeView(props: CustomNodeViewProps) { 
    return new TitleNodeView(props); 
  }
}
