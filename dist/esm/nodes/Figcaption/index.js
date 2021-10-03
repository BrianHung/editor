import { Node } from "../../Node.js";
import { onEnterFigcaption, onBackspaceFigcaption } from "./keymaps.js";
export const Figcaption = (options) => Node(Object.assign({ name: "figcaption", content: "inline*", group: "figure", parseDOM: [{ tag: "figcaption" }], toDOM() { return ["figcaption", 0]; },
    keymap({ nodeType }) {
        return {
            "Enter": onEnterFigcaption,
            "Backspace": onBackspaceFigcaption,
        };
    } }, options));
