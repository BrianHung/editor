"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const commands_1 = require("../../commands");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_commands_1 = require("prosemirror-commands");
class BlockQuote extends Node_1.default {
    get name() {
        return "blockquote";
    }
    get schema() {
        return {
            attrs: { type: { default: null } },
            content: "block+",
            group: "block",
            parseDOM: [{ tag: "blockquote", getAttrs(div) { return { type: div.dataset.type }; } }],
            toDOM(node) { return ["blockquote", Object.assign({}, node.attrs.type && { 'data-type': node.attrs.type }), 0]; },
        };
    }
    inputRules({ nodeType }) {
        return [
            prosemirror_inputrules_1.wrappingInputRule(/^> $/, nodeType),
            prosemirror_inputrules_1.wrappingInputRule(/^" $/, nodeType, { type: "pullquote" })
        ];
    }
    commands({ nodeType }) {
        return {
            "blockquote": () => commands_1.toggleWrap(nodeType),
            "pullquote": () => commands_1.toggleWrap(nodeType, { type: "pullquote" }),
        };
    }
    keys({ nodeType }) {
        return {
            'Ctrl->': prosemirror_commands_1.wrapIn(nodeType),
            'Ctrl-"': prosemirror_commands_1.wrapIn(nodeType, { type: "pullquote" })
        };
    }
}
exports.default = BlockQuote;
