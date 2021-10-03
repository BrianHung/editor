"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Math = void 0;
const Mark_js_1 = require("../../Mark.js");
const inline_math_plugin_js_1 = __importDefault(require("./inline-math-plugin.js"));
const Math = (options) => (0, Mark_js_1.Mark)(Object.assign({ name: 'math', inclusive: false, toDOM: () => ['math', { "spellCheck": "false" }, 0], parseDOM: [{ tag: 'math' }], plugins() {
        return [(0, inline_math_plugin_js_1.default)()];
    } }, options));
exports.Math = Math;
