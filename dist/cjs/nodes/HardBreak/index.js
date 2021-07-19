"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const prosemirror_commands_1 = require("prosemirror-commands");
class HardBreak extends Node_1.default {
    get name() {
        return 'hardbreak';
    }
    get schema() {
        return {
            inline: true,
            group: "inline",
            selectable: false,
            parseDOM: [{ tag: 'br' }],
            toDOM() { return ['br']; },
        };
    }
    keys({ nodeType }) {
        return {
            'Mod-Enter': exitAndInsert(nodeType),
            'Shift-Enter': exitAndInsert(nodeType),
        };
    }
}
exports.default = HardBreak;
function exitAndInsert(nodeType) {
    return prosemirror_commands_1.chainCommands(prosemirror_commands_1.exitCode, (state, dispatch) => {
        dispatch(state.tr.replaceSelectionWith(nodeType.create()).scrollIntoView());
        return true;
    });
}
