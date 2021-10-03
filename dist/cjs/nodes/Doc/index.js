"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doc = void 0;
const Node_js_1 = require("../../Node.js");
const Doc = (options) => (0, Node_js_1.Node)(Object.assign({ name: "doc", content: "block+", marks: "link" }, options));
exports.Doc = Doc;
