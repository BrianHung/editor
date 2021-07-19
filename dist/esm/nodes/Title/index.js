import Node from "../Node";
import TitleNodeView from "./title-nodeview";
export default class Title extends Node {
    get name() {
        return "title";
    }
    get schema() {
        return {
            content: "inline*",
            parseDOM: [{ tag: "h1" }],
            toDOM: (node) => ["h1", { class: "title" }, 0],
        };
    }
    get defaultOptions() {
        return {
            handleTitleChange: (title) => document.title = title || "Untitled"
        };
    }
    customNodeView(props) {
        return new TitleNodeView(props);
    }
}
