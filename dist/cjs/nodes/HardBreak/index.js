"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardBreak = void 0;
const Node_js_1 = require("../../Node.js");
const prosemirror_commands_1 = require("prosemirror-commands");
const HardBreak = (options) => (0, Node_js_1.Node)(Object.assign({ name: 'hardbreak', inline: true, group: "inline", selectable: false, parseDOM: [{ tag: 'br' }], toDOM() { return ['br']; },
    commands({ nodeType }) {
        return {
            hardbreak: () => exitAndInsert(nodeType)
        };
    },
    keymap({ nodeType }) {
        return {
            'Mod-Enter': exitAndInsert(nodeType),
            'Shift-Enter': exitAndInsert(nodeType),
        };
    } }, options));
exports.HardBreak = HardBreak;
function exitAndInsert(nodeType) {
    return (0, prosemirror_commands_1.chainCommands)(prosemirror_commands_1.exitCode, (state, dispatch) => {
        dispatch(state.tr.replaceSelectionWith(nodeType.create()).scrollIntoView());
        return true;
    });
}
