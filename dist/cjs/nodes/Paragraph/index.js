"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paragraph = void 0;
const prosemirror_commands_1 = require("prosemirror-commands");
const Node_js_1 = require("../../Node.js");
const Paragraph = (options) => (0, Node_js_1.Node)(Object.assign({ name: "paragraph", content: "inline*", group: "block", parseDOM: [{ tag: "p" }], toDOM() { return ["p", 0]; },
    keymap({ nodeType }) {
        return {
            "Mod-Alt-0": (0, prosemirror_commands_1.setBlockType)(nodeType),
        };
    },
    commands({ nodeType }) {
        return {
            'paragraph': () => (0, prosemirror_commands_1.setBlockType)(nodeType)
        };
    } }, options));
exports.Paragraph = Paragraph;
