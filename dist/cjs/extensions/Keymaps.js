"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keymaps = void 0;
const Extension_js_1 = require("../Extension.js");
const prosemirror_commands_1 = require("prosemirror-commands");
const index_js_1 = require("../commands/index.js");
const Keymaps = (options) => (0, Extension_js_1.Extension)(Object.assign({ name: 'keymaps', keymap() {
        return {
            "Alt-ArrowUp": prosemirror_commands_1.joinUp,
            "Alt-ArrowDown": prosemirror_commands_1.joinDown,
            "Mod-[": prosemirror_commands_1.lift,
            "Escape": prosemirror_commands_1.selectParentNode,
            "Mod-c": index_js_1.selectTextblock,
            "Mod-x": index_js_1.selectTextblock,
            "Ctrl-Space": index_js_1.removeAllMarks,
        };
    } }, options));
exports.Keymaps = Keymaps;
