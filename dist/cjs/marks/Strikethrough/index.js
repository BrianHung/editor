"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strikethrough = void 0;
const Mark_js_1 = require("../../Mark.js");
const markInputRule_js_1 = require("../../utils/markInputRule.js");
const prosemirror_commands_1 = require("prosemirror-commands");
const Strikethrough = (options) => (0, Mark_js_1.Mark)(Object.assign({ name: 'strikethrough', parseDOM: [{ tag: 's' }, { tag: 'del' }, { tag: 'strike' }, { style: 'text-decoration', getAttrs: (value) => value.includes('line-through') && null }], toDOM() { return ['s', 0]; },
    inputRules({ markType }) {
        return [
            (0, markInputRule_js_1.markInputRule)(/(?:~~)([^~\s]+(?:\s+[^~\s]+)*)(?:~~)$/, markType),
        ];
    },
    commands({ markType }) {
        return {
            strikethrough: () => (0, prosemirror_commands_1.toggleMark)(markType)
        };
    },
    keymap({ markType }) {
        return {
            'Mod-d': (0, prosemirror_commands_1.toggleMark)(markType),
            'Mod-D': (0, prosemirror_commands_1.toggleMark)(markType),
        };
    } }, options));
exports.Strikethrough = Strikethrough;
