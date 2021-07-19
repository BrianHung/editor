"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const commands_1 = require("../../commands");
class Embed extends Node_1.default {
    get name() {
        return "embed";
    }
    get schema() {
        return {
            attrs: { url: { default: null }, alt: { default: null }, title: { default: null }, align: { default: "center" } },
            inline: false,
            group: "block",
            draggable: true,
            parseDOM: [{
                    tag: 'a.embed',
                    getAttrs(a) {
                        return { url: a.href };
                    }
                }],
            toDOM(node) {
                return ['a', { class: 'embed', href: node.attrs.url }, node.attrs.url];
            }
        };
    }
    inputRules({ nodeType }) {
        return [
            commands_1.nodeInputRule(/^embed:([^\s]*)[\s\n]$/, nodeType, match => (Object.assign({}, match[1] && { url: match[1] })))
        ];
    }
}
exports.default = Embed;
