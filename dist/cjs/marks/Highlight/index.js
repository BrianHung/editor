"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mark_1 = __importDefault(require("../Mark"));
const markInputRule_1 = __importDefault(require("../../commands/markInputRule"));
const prosemirror_commands_1 = require("prosemirror-commands");
class Highlight extends Mark_1.default {
    get name() {
        return 'highlight';
    }
    get schema() {
        return {
            parseDOM: [{ tag: "mark" }],
            toDOM() { return ["mark", 0]; },
        };
    }
    keys({ markType }) {
        return {
            'Mod-h': prosemirror_commands_1.toggleMark(markType),
            'Mod-H': prosemirror_commands_1.toggleMark(markType),
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule_1.default(/(?:==)([^=\s]+(?:\s+[^=\s]+)*)(?:==)$/, markType),
        ];
    }
}
exports.default = Highlight;
