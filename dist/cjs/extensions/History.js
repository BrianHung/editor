"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = void 0;
const Extension_js_1 = require("../Extension.js");
const prosemirror_history_1 = require("prosemirror-history");
const History = (options) => (0, Extension_js_1.Extension)(Object.assign({ name: 'history', keymap() {
        return {
            "Mod-z": prosemirror_history_1.undo,
            "Mod-Z": prosemirror_history_1.undo,
            "Mod-y": prosemirror_history_1.redo,
            "Mod-Y": prosemirror_history_1.redo,
            "Shift-Mod-z": prosemirror_history_1.redo,
            "Shift-Mod-Z": prosemirror_history_1.redo,
        };
    },
    plugins() {
        return [(0, prosemirror_history_1.history)()];
    } }, options));
exports.History = History;
