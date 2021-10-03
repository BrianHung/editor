import { setBlockType } from "prosemirror-commands";
import { Node } from "../../Node.js";
export const Paragraph = (options) => Node(Object.assign({ name: "paragraph", content: "inline*", group: "block", parseDOM: [{ tag: "p" }], toDOM() { return ["p", 0]; },
    keymap({ nodeType }) {
        return {
            "Mod-Alt-0": setBlockType(nodeType),
        };
    },
    commands({ nodeType }) {
        return {
            'paragraph': () => setBlockType(nodeType)
        };
    } }, options));
