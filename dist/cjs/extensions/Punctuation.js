"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Punctuation = exports.longRightArrow = exports.longLeftArrow = exports.rightArrow = exports.leftArrow = void 0;
const Extension_js_1 = require("../Extension.js");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_inputrules_2 = require("prosemirror-inputrules");
exports.leftArrow = new prosemirror_inputrules_1.InputRule(/<-$/, "←");
exports.rightArrow = new prosemirror_inputrules_1.InputRule(/->$/, "→");
exports.longLeftArrow = new prosemirror_inputrules_1.InputRule(/←-$/, "⟵");
exports.longRightArrow = new prosemirror_inputrules_1.InputRule(/—>$/, "⟶");
const Punctuation = (options) => (0, Extension_js_1.Extension)(Object.assign({ name: 'punctuation', inputRules() {
        return [
            prosemirror_inputrules_2.emDash,
            prosemirror_inputrules_2.ellipsis,
            exports.leftArrow,
            exports.rightArrow,
            exports.longLeftArrow,
            exports.longRightArrow
        ];
    } }, options));
exports.Punctuation = Punctuation;
