"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Extension_1 = __importDefault(require("./Extension"));
const prosemirror_commands_1 = require("prosemirror-commands");
class Keymaps extends Extension_1.default {
    get name() {
        return 'keymaps';
    }
    keys() {
        return {
            "Mod-c": selectEntireTextblock,
            "Mod-x": selectEntireTextblock,
            "Escape": prosemirror_commands_1.selectParentNode,
            "Ctrl-Space": clearTextFormatting,
        };
    }
}
exports.default = Keymaps;
const prosemirror_state_1 = require("prosemirror-state");
function selectEntireTextblock(state, dispatch) {
    let { selection, tr, doc } = state;
    if (!selection.empty) {
        return false;
    }
    let $anchor = selection.$anchor;
    if ($anchor.parent.isTextblock === false) {
        return false;
    }
    const nodeStart = $anchor.pos - $anchor.parentOffset, nodeEnd = nodeStart + $anchor.parent.content.size;
    dispatch(tr.setSelection(prosemirror_state_1.TextSelection.create(doc, nodeStart, nodeEnd)));
    return true;
}
function clearTextFormatting(state, dispatch) {
    let { selection, tr } = state;
    if (!(selection instanceof prosemirror_state_1.TextSelection) || selection.empty) {
        return false;
    }
    dispatch(tr.removeMark(selection.from, selection.to));
    return true;
}
