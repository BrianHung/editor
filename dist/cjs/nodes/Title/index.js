"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Title = void 0;
const Node_js_1 = require("../../Node.js");
const Title = (options) => (0, Node_js_1.Node)(Object.assign({ name: "title", content: "inline*", parseDOM: [{ tag: "h1" }], toDOM: (node) => ["h1", { class: "title" }, 0] }, options));
exports.Title = Title;
