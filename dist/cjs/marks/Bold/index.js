"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mark_1 = __importDefault(require("../Mark"));
const markInputRule_1 = __importDefault(require("../../commands/markInputRule"));
const prosemirror_commands_1 = require("prosemirror-commands");
class Bold extends Mark_1.default {
    get name() {
        return "bold";
    }
    get schema() {
        return {
            parseDOM: [{ tag: 'strong' }, { tag: 'b', getAttrs: (dom) => { var _a; return ((_a = dom.style) === null || _a === void 0 ? void 0 : _a.fontWeight) !== 'normal' && null; } }, { style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[7-9]\d{2,})$/.test(value) && null }],
            toDOM: () => ['strong', 0],
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule_1.default(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, markType),
        ];
    }
    keys({ markType }) {
        return {
            'Mod-b': prosemirror_commands_1.toggleMark(markType),
            'Mod-B': prosemirror_commands_1.toggleMark(markType),
        };
    }
}
exports.default = Bold;
