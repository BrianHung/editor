"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
class Figure extends Node_1.default {
    get name() {
        return "figure";
    }
    get schema() {
        return {
            content: "image+ figcaption?",
            group: "block",
            parseDOM: [{
                    tag: "figure",
                    getAttrs(dom) {
                        return dom.querySelector("img[src]") ? {} : false;
                    },
                }],
            toDOM() {
                return ["figure", 0];
            }
        };
    }
}
exports.default = Figure;
