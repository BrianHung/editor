"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heading = void 0;
const Node_js_1 = require("../../Node.js");
const index_js_1 = require("../../commands/index.js");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_commands_1 = require("prosemirror-commands");
const Heading = (options) => (0, Node_js_1.Node)(Object.assign({ name: "heading", attrs: { level: { default: 1 } }, content: "inline*", group: "block", defining: true, parseDOM: [
        { tag: "h1", attrs: { level: 1 } },
        { tag: "h2", attrs: { level: 2 } },
        { tag: "h3", attrs: { level: 3 } },
        { tag: "h4", attrs: { level: 4 } },
        { tag: "h5", attrs: { level: 5 } },
        { tag: "h6", attrs: { level: 6 } }
    ], toDOM(node) { return ["h" + node.attrs.level, 0]; },
    commands({ nodeType }) {
        return {
            heading: attrs => (0, index_js_1.toggleBlockType)(nodeType, attrs)
        };
    },
    inputRules({ nodeType }) {
        return [
            (0, prosemirror_inputrules_1.textblockTypeInputRule)(new RegExp(`^(#{1,6})\\s$`), nodeType, match => ({ level: match[1].length }))
        ];
    },
    keymap({ nodeType }) {
        return {
            "Mod-Alt-1": (0, prosemirror_commands_1.setBlockType)(nodeType, { level: 1 }),
            "Mod-Alt-2": (0, prosemirror_commands_1.setBlockType)(nodeType, { level: 2 }),
            "Mod-Alt-3": (0, prosemirror_commands_1.setBlockType)(nodeType, { level: 3 }),
            "Mod-Alt-4": (0, prosemirror_commands_1.setBlockType)(nodeType, { level: 4 }),
            "Mod-Alt-5": (0, prosemirror_commands_1.setBlockType)(nodeType, { level: 5 }),
            "Mod-Alt-6": (0, prosemirror_commands_1.setBlockType)(nodeType, { level: 6 }),
        };
    } }, options));
exports.Heading = Heading;
