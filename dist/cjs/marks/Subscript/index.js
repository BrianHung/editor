"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mark_1 = __importDefault(require("../Mark"));
const prosemirror_commands_1 = require("prosemirror-commands");
class Subscript extends Mark_1.default {
    get name() {
        return 'subscript';
    }
    get schema() {
        return {
            excludes: "superscript",
            parseDOM: [{ tag: "sub" }, { style: 'vertical-align', getAttrs: value => value == 'sub' ? {} : false }],
            toDOM() { return ["sub", 0]; },
        };
    }
    keys({ markType }) {
        return {
            'Mod-,': prosemirror_commands_1.toggleMark(markType),
        };
    }
}
exports.default = Subscript;
