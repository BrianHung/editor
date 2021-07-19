"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const Node_1 = __importDefault(require("../Node"));
class Paragraph extends Node_1.default {
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
            "Mod-Alt-0": prosemirror_commands_1.setBlockType(nodeType),
        };
    }
    commands({ nodeType }) {
        return () => prosemirror_commands_1.setBlockType(nodeType);
    }
}
exports.default = Paragraph;
