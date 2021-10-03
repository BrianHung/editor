"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Source = void 0;
const Node_js_1 = require("../../Node.js");
const Source = (options) => (0, Node_js_1.Node)(Object.assign({ name: "source", attrs: { src: { default: undefined }, media: { default: undefined }, type: { default: undefined } }, inline: false, group: "block", parseDOM: [{ tag: "source" }], toDOM(node) { return ["source", Object.assign({}, node.attrs)]; } }, options));
exports.Source = Source;
