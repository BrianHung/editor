import { setBlockType } from "prosemirror-commands";
import Node from "../Node";
export default class Paragraph extends Node {
    get name() {
        return "paragraph";
    }
    get schema() {
        return {
            content: "inline*",
            group: "block",
            parseDOM: [{ tag: "p" }],
            toDOM() { return ["p", 0]; },
        };
    }
    keys({ nodeType }) {
        return {
            "Mod-Alt-0": setBlockType(nodeType),
        };
    }
    commands({ nodeType }) {
        return () => setBlockType(nodeType);
    }
}
