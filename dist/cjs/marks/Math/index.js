"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mark_1 = __importDefault(require("../Mark"));
const inline_math_plugin_1 = __importDefault(require("./inline-math-plugin"));
class Math extends Mark_1.default {
    get name() {
        return 'math';
    }
    get schema() {
        return {
            inclusive: false,
            toDOM: () => ['math', { "spellCheck": "false" }, 0],
            parseDOM: [{ tag: 'math' }],
        };
    }
    get plugins() {
        return [inline_math_plugin_1.default()];
    }
}
exports.default = Math;
