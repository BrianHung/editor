"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bold = void 0;
const Mark_js_1 = require("../../Mark.js");
const markInputRule_js_1 = require("../../utils/markInputRule.js");
const prosemirror_commands_1 = require("prosemirror-commands");
const Bold = (options) => (0, Mark_js_1.Mark)(Object.assign({ name: "bold", parseDOM: [{ tag: 'strong' }, { tag: 'b', getAttrs: (dom) => { var _a; return ((_a = dom.style) === null || _a === void 0 ? void 0 : _a.fontWeight) !== 'normal' && null; } }, { style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[7-9]\d{2,})$/.test(value) && null }], toDOM: () => ['strong', 0], inputRules({ markType }) {
        return [
            (0, markInputRule_js_1.markInputRule)(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, markType),
        ];
    },
    keymap({ markType }) {
        return {
            'Mod-b': (0, prosemirror_commands_1.toggleMark)(markType),
            'Mod-B': (0, prosemirror_commands_1.toggleMark)(markType),
        };
    },
    commands({ markType }) {
        return {
            bold: () => (0, prosemirror_commands_1.toggleMark)(markType)
        };
    } }, options));
exports.Bold = Bold;
