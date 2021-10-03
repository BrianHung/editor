"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const index_js_1 = require("../utils/index.js");
function toggleWrapType(type, attrs = null) {
    return function (state, dispatch) {
        return (0, index_js_1.wrapTypeActive)(state, type, attrs) ? (0, prosemirror_commands_1.lift)(state, dispatch) : (0, prosemirror_commands_1.wrapIn)(type, attrs)(state, dispatch);
    };
}
exports.default = toggleWrapType;
