"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const index_js_1 = require("../utils/index.js");
function toggleBlockType(nodeType, attrs = {}) {
    return function (state, dispatch) {
        let active = (0, index_js_1.blockTypeActive)(state, nodeType, attrs);
        if (active === false)
            return (0, prosemirror_commands_1.setBlockType)(nodeType, attrs)(state, dispatch);
        let { $head, $anchor } = state.selection;
        let above = $head.node(-1), after = $head.indexAfter(-1), type = (0, index_js_1.defaultBlockAt)(above.contentMatchAt(after));
        return (0, prosemirror_commands_1.setBlockType)(type)(state, dispatch);
    };
}
exports.default = toggleBlockType;
