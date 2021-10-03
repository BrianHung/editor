"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Figure = void 0;
const Node_js_1 = require("../../Node.js");
const Figure = (options) => (0, Node_js_1.Node)(Object.assign({ name: "figure", content: "image+ figcaption?", group: "block", parseDOM: [{
            tag: "figure",
            getAttrs(dom) { return dom.querySelector("img[src]") ? {} : false; },
        }], toDOM() { return ["figure", 0]; } }, options));
exports.Figure = Figure;
