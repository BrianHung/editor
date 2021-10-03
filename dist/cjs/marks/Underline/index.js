"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Underline = void 0;
const Mark_js_1 = require("../../Mark.js");
const prosemirror_commands_1 = require("prosemirror-commands");
const markInputRule_js_1 = require("../../utils/markInputRule.js");
const Underline = (options) => (0, Mark_js_1.Mark)(Object.assign({ name: 'underline', parseDOM: [{ tag: 'u' }, { tag: ':not(a)', getAttrs: (dom) => { var _a, _b; return (((_a = dom.style) === null || _a === void 0 ? void 0 : _a.textDecoration.includes("underline")) || ((_b = dom.style) === null || _b === void 0 ? void 0 : _b.textDecorationLine.includes("underline"))) && null; }, consuming: false }], toDOM() { return ['u', 0]; },
    inputRules({ markType }) {
        return [
            (0, markInputRule_js_1.markInputRule)(/(?:__)([^_]+)(?:__)$/, markType)
        ];
    },
    keymap({ markType }) {
        return {
            'Mod-u': (0, prosemirror_commands_1.toggleMark)(markType),
            'Mod-U': (0, prosemirror_commands_1.toggleMark)(markType),
        };
    },
    commands({ markType }) {
        return {
            underline: () => (0, prosemirror_commands_1.toggleMark)(markType)
        };
    } }, options));
exports.Underline = Underline;
