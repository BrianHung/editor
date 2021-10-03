"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Italic = void 0;
const Mark_js_1 = require("../../Mark.js");
const markInputRule_js_1 = require("../../utils/markInputRule.js");
const prosemirror_commands_1 = require("prosemirror-commands");
const Italic = (options) => (0, Mark_js_1.Mark)(Object.assign({ name: 'italic', parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }], toDOM() { return ["em", 0]; },
    inputRules({ markType }) {
        return [
            (0, markInputRule_js_1.markInputRule)(/(?:^|[^*])(\*([^*]+)\*)$/, markType),
        ];
    },
    commands({ markType }) {
        return {
            italic: () => (0, prosemirror_commands_1.toggleMark)(markType)
        };
    },
    keymap({ markType }) {
        return {
            'Mod-i': (0, prosemirror_commands_1.toggleMark)(markType),
            'Mod-I': (0, prosemirror_commands_1.toggleMark)(markType),
        };
    } }, options));
exports.Italic = Italic;
