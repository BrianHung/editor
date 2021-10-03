"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusMode = void 0;
const Extension_js_1 = require("../Extension.js");
const FocusMode_js_1 = require("../plugins/FocusMode.js");
const FocusMode = (options) => (0, Extension_js_1.Extension)(Object.assign({ name: 'focusMode', plugins() {
        return [
            (0, FocusMode_js_1.FocusMode)()
        ];
    },
    commands() {
        return {
            focusMode: focus => (0, FocusMode_js_1.toggleFocusMode)(focus)
        };
    },
    keymap() {
        return {
            "Shift-Ctrl-f": (0, FocusMode_js_1.toggleFocusMode)()
        };
    } }, options));
exports.FocusMode = FocusMode;
