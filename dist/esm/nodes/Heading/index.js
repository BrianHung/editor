import { Node } from "../../Node.js";
import { toggleBlockType } from '../../commands/index.js';
import { textblockTypeInputRule } from "prosemirror-inputrules";
import { setBlockType } from "prosemirror-commands";
export const Heading = (options) => Node(Object.assign({ name: "heading", attrs: { level: { default: 1 } }, content: "inline*", group: "block", defining: true, parseDOM: [
        { tag: "h1", attrs: { level: 1 } },
        { tag: "h2", attrs: { level: 2 } },
        { tag: "h3", attrs: { level: 3 } },
        { tag: "h4", attrs: { level: 4 } },
        { tag: "h5", attrs: { level: 5 } },
        { tag: "h6", attrs: { level: 6 } }
    ], toDOM(node) { return ["h" + node.attrs.level, 0]; },
    commands({ nodeType }) {
        return {
            heading: attrs => toggleBlockType(nodeType, attrs)
        };
    },
    inputRules({ nodeType }) {
        return [
            textblockTypeInputRule(new RegExp(`^(#{1,6})\\s$`), nodeType, match => ({ level: match[1].length }))
        ];
    },
    keymap({ nodeType }) {
        return {
            "Mod-Alt-1": setBlockType(nodeType, { level: 1 }),
            "Mod-Alt-2": setBlockType(nodeType, { level: 2 }),
            "Mod-Alt-3": setBlockType(nodeType, { level: 3 }),
            "Mod-Alt-4": setBlockType(nodeType, { level: 4 }),
            "Mod-Alt-5": setBlockType(nodeType, { level: 5 }),
            "Mod-Alt-6": setBlockType(nodeType, { level: 6 }),
        };
    } }, options));
