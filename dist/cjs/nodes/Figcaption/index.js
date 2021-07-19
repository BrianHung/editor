"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const keymaps_1 = require("./keymaps");
class Figcaption extends Node_1.default {
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
            "Enter": keymaps_1.onEnterFigcaption,
            "Backspace": keymaps_1.onBackspaceFigcaption,
        };
    }
}
exports.default = Figcaption;
