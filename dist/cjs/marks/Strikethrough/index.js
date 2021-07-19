"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mark_1 = __importDefault(require("../Mark"));
const markInputRule_1 = __importDefault(require("../../commands/markInputRule"));
const prosemirror_commands_1 = require("prosemirror-commands");
class Strikethrough extends Mark_1.default {
    get name() {
        return 'strikethrough';
    }
    get schema() {
        return {
            parseDOM: [{ tag: 's' }, { tag: 'del' }, { tag: 'strike' }, { style: 'text-decoration', getAttrs: (value) => value.includes('line-through') && null },],
            toDOM() { return ['s', 0]; },
        };
    }
    keys({ markType }) {
        return {
            'Mod-d': prosemirror_commands_1.toggleMark(markType),
            'Mod-D': prosemirror_commands_1.toggleMark(markType),
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule_1.default(/(?:~~)([^~\s]+(?:\s+[^~\s]+)*)(?:~~)$/, markType),
        ];
    }
}
exports.default = Strikethrough;
