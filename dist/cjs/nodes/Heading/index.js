"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const commands_1 = require("../../commands");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_commands_1 = require("prosemirror-commands");
class Heading extends Node_1.default {
    get name() {
        return 'heading';
    }
    get schema() {
        return {
            attrs: { level: { default: 1 } },
            content: "inline*",
            group: "block",
            defining: true,
            parseDOM: [
                { tag: "h1", attrs: { level: 1 } },
                { tag: "h2", attrs: { level: 2 } },
                { tag: "h3", attrs: { level: 3 } },
                { tag: "h4", attrs: { level: 4 } },
                { tag: "h5", attrs: { level: 5 } },
                { tag: "h6", attrs: { level: 6 } }
            ],
            toDOM(node) { return ["h" + node.attrs.level, 0]; },
        };
    }
    commands({ nodeType, schema }) {
        return attrs => commands_1.toggleBlockType(nodeType, schema.nodes.paragraph, attrs);
    }
    inputRules({ nodeType }) {
        return [
            prosemirror_inputrules_1.textblockTypeInputRule(new RegExp(`^(#{1,6})\\s$`), nodeType, match => ({ level: match[1].length }))
        ];
    }
    keys({ nodeType }) {
        return {
            "Mod-Alt-1": prosemirror_commands_1.setBlockType(nodeType, { level: 1 }),
            "Mod-Alt-2": prosemirror_commands_1.setBlockType(nodeType, { level: 2 }),
            "Mod-Alt-3": prosemirror_commands_1.setBlockType(nodeType, { level: 3 }),
            "Mod-Alt-4": prosemirror_commands_1.setBlockType(nodeType, { level: 4 }),
            "Mod-Alt-5": prosemirror_commands_1.setBlockType(nodeType, { level: 5 }),
            "Mod-Alt-6": prosemirror_commands_1.setBlockType(nodeType, { level: 6 }),
        };
    }
}
exports.default = Heading;
