"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscript = void 0;
const Mark_js_1 = require("../../Mark.js");
const prosemirror_commands_1 = require("prosemirror-commands");
const Subscript = (options) => (0, Mark_js_1.Mark)(Object.assign({ name: 'subscript', excludes: 'superscript', parseDOM: [{ tag: "sub" }, { style: 'vertical-align', getAttrs: value => value == 'sub' ? {} : false }], toDOM() { return ["sub", 0]; },
    commands({ markType }) {
        return {
            subscript: () => (0, prosemirror_commands_1.toggleMark)(markType)
        };
    },
    keymap({ markType }) {
        return {
            'Mod-,': (0, prosemirror_commands_1.toggleMark)(markType),
        };
    } }, options));
exports.Subscript = Subscript;
