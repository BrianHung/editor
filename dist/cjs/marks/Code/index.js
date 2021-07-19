"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mark_1 = __importDefault(require("../Mark"));
const markInputRule_1 = __importDefault(require("../../commands/markInputRule"));
const prosemirror_commands_1 = require("prosemirror-commands");
class Code extends Mark_1.default {
    get name() {
        return 'code';
    }
    get schema() {
        return {
            parseDOM: [{ tag: "code" }],
            toDOM() { return ["code", { "spellCheck": "false" }, 0]; },
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule_1.default(/(?:`)([^`]+)(?:`)$/, markType),
        ];
    }
    keys({ markType }) {
        return {
            'Mod-e': prosemirror_commands_1.toggleMark(markType),
            'Mod-E': prosemirror_commands_1.toggleMark(markType),
        };
    }
}
exports.default = Code;
