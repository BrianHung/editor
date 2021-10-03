"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code = void 0;
const Mark_js_1 = require("../../Mark.js");
const markInputRule_js_1 = require("../../utils/markInputRule.js");
const prosemirror_commands_1 = require("prosemirror-commands");
const Code = (options) => (0, Mark_js_1.Mark)(Object.assign({ name: "code", parseDOM: [{ tag: "code" }], toDOM() { return ["code", { "spellCheck": "false" }, 0]; },
    inputRules({ markType }) {
        return [
            (0, markInputRule_js_1.markInputRule)(/(?:`)([^`]+)(?:`)$/, markType),
        ];
    },
    keymap({ markType }) {
        return {
            'Mod-e': (0, prosemirror_commands_1.toggleMark)(markType),
            'Mod-E': (0, prosemirror_commands_1.toggleMark)(markType),
        };
    },
    commands({ markType }) {
        return {
            code: () => (0, prosemirror_commands_1.toggleMark)(markType)
        };
    } }, options));
exports.Code = Code;
