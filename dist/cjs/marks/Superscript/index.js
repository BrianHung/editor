"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Superscript = void 0;
const Mark_js_1 = require("../../Mark.js");
const prosemirror_commands_1 = require("prosemirror-commands");
const Superscript = (options) => (0, Mark_js_1.Mark)(Object.assign({ name: 'superscript', excludes: 'subscript', parseDOM: [{ tag: "sup" }, { style: 'vertical-align', getAttrs: value => value == 'sup' ? {} : false }], toDOM() { return ["sup", 0]; },
    commands({ markType }) {
        return {
            superscript: () => (0, prosemirror_commands_1.toggleMark)(markType)
        };
    },
    keymap({ markType }) {
        return {
            'Mod-.': (0, prosemirror_commands_1.toggleMark)(markType),
        };
    } }, options));
exports.Superscript = Superscript;
