"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
const Node_js_1 = require("../../Node.js");
const Text = (options) => (0, Node_js_1.Node)(Object.assign({ name: "text", group: "inline" }, options));
exports.Text = Text;
