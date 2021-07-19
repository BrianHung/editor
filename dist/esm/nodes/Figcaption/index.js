import Node from '../Node';
import { onEnterFigcaption, onBackspaceFigcaption } from "./keymaps";
export default class Figcaption extends Node {
    get name() {
        return "figcaption";
    }
    get schema() {
        return {
            content: "inline*",
            group: "figure",
            parseDOM: [{ tag: "figcaption" }],
            toDOM() { return ["figcaption", 0]; },
        };
    }
    keys({ nodeType }) {
        return {
            "Enter": onEnterFigcaption,
            "Backspace": onBackspaceFigcaption,
        };
    }
}
