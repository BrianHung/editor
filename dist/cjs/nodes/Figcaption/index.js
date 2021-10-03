"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Figcaption = void 0;
const Node_js_1 = require("../../Node.js");
const keymaps_js_1 = require("./keymaps.js");
const Figcaption = (options) => (0, Node_js_1.Node)(Object.assign({ name: "figcaption", content: "inline*", group: "figure", parseDOM: [{ tag: "figcaption" }], toDOM() { return ["figcaption", 0]; },
    keymap({ nodeType }) {
        return {
            "Enter": keymaps_js_1.onEnterFigcaption,
            "Backspace": keymaps_js_1.onBackspaceFigcaption,
        };
    } }, options));
exports.Figcaption = Figcaption;
