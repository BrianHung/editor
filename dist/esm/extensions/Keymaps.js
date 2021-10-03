import { Extension } from '../Extension.js';
import { selectParentNode, lift, joinUp, joinDown } from "prosemirror-commands";
import { selectTextblock, removeAllMarks } from "../commands/index.js";
export const Keymaps = (options) => Extension(Object.assign({ name: 'keymaps', keymap() {
        return {
            "Alt-ArrowUp": joinUp,
            "Alt-ArrowDown": joinDown,
            "Mod-[": lift,
            "Escape": selectParentNode,
            "Mod-c": selectTextblock,
            "Mod-x": selectTextblock,
            "Ctrl-Space": removeAllMarks,
        };
    } }, options));
