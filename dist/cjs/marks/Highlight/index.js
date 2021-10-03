"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Highlight = void 0;
const Mark_js_1 = require("../../Mark.js");
const markInputRule_js_1 = require("../../utils/markInputRule.js");
const prosemirror_commands_1 = require("prosemirror-commands");
const Highlight = (options) => (0, Mark_js_1.Mark)(Object.assign({ name: 'highlight', parseDOM: [{ tag: "mark" }], toDOM() { return ["mark", 0]; },
    inputRules({ markType }) {
        return [
            (0, markInputRule_js_1.markInputRule)(/(?:==)([^=\s]+(?:\s+[^=\s]+)*)(?:==)$/, markType),
        ];
    },
    commands({ markType }) {
        return {
            highlight: () => (0, prosemirror_commands_1.toggleMark)(markType)
        };
    },
    keymap({ markType }) {
        return {
            'Mod-h': (0, prosemirror_commands_1.toggleMark)(markType),
            'Mod-H': (0, prosemirror_commands_1.toggleMark)(markType),
        };
    } }, options));
exports.Highlight = Highlight;
