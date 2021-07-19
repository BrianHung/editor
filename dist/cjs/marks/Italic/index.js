"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mark_1 = __importDefault(require("../Mark"));
const markInputRule_1 = __importDefault(require("../../commands/markInputRule"));
const prosemirror_commands_1 = require("prosemirror-commands");
class Italic extends Mark_1.default {
    get name() {
        return 'italic';
    }
    get schema() {
        return {
            parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
            toDOM() { return ["em", 0]; },
        };
    }
    keys({ markType }) {
        return {
            'Mod-i': prosemirror_commands_1.toggleMark(markType),
            'Mod-I': prosemirror_commands_1.toggleMark(markType),
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule_1.default(/(?:^|[^*])(\*([^*]+)\*)$/, markType),
        ];
    }
}
exports.default = Italic;
