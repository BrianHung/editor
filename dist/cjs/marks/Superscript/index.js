"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mark_1 = __importDefault(require("../Mark"));
const prosemirror_commands_1 = require("prosemirror-commands");
class Superscript extends Mark_1.default {
    get name() {
        return 'superscript';
    }
    get schema() {
        return {
            excludes: "subscript",
            parseDOM: [{ tag: "sup" }, { style: 'vertical-align', getAttrs: value => value == 'sup' ? {} : false }],
            toDOM() { return ["sup", 0]; },
        };
    }
    keys({ markType }) {
        return {
            'Mod-.': prosemirror_commands_1.toggleMark(markType),
        };
    }
}
exports.default = Superscript;
