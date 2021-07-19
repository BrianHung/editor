"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
class Source extends Node_1.default {
    get name() {
        return "source";
    }
    get schema() {
        return {
            attrs: { src: { default: undefined }, media: { default: undefined }, type: { default: undefined } },
            inline: false,
            group: "block",
            parseDOM: [{ tag: "source" }],
            toDOM(node) { return ["source", Object.assign({}, node.attrs)]; },
        };
    }
}
exports.default = Source;
