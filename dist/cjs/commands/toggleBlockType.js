"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const utils_1 = require("../utils");
function toggleBlockType(type, toggletype, attrs = {}) {
    return (state, dispatch, view) => {
        const isActive = utils_1.nodeIsActive(state, type, attrs);
        if (isActive)
            return prosemirror_commands_1.setBlockType(toggletype)(state, dispatch);
        return prosemirror_commands_1.setBlockType(type, attrs)(state, dispatch);
    };
}
exports.default = toggleBlockType;
