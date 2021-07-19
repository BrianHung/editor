"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const utils_1 = require("../utils");
function toggleWrap(type, attrs) {
    return (state, dispatch) => {
        utils_1.nodeIsActive(state, type, attrs)
            ? prosemirror_commands_1.lift(state, dispatch)
            : prosemirror_commands_1.wrapIn(type, attrs)(state, dispatch);
    };
}
exports.default = toggleWrap;
