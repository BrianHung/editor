"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mark_1 = __importDefault(require("../Mark"));
const prosemirror_commands_1 = require("prosemirror-commands");
const markInputRule_1 = __importDefault(require("../../commands/markInputRule"));
class Underline extends Mark_1.default {
    get name() {
        return 'underline';
    }
    get schema() {
        return {
            parseDOM: [{ tag: 'u' }, { tag: ':not(a)', getAttrs: (dom) => { var _a, _b; return (((_a = dom.style) === null || _a === void 0 ? void 0 : _a.textDecoration.includes("underline")) || ((_b = dom.style) === null || _b === void 0 ? void 0 : _b.textDecorationLine.includes("underline"))) && null; }, consuming: false }],
            toDOM() { return ['u', 0]; },
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule_1.default(/(?:__)([^_]+)(?:__)$/, markType)
        ];
    }
    keys({ markType }) {
        return {
            'Mod-u': prosemirror_commands_1.toggleMark(markType),
            'Mod-U': prosemirror_commands_1.toggleMark(markType),
        };
    }
}
exports.default = Underline;
