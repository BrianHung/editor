"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const title_nodeview_1 = __importDefault(require("./title-nodeview"));
class Title extends Node_1.default {
    get name() {
        return "title";
    }
    get schema() {
        return {
            content: "inline*",
            parseDOM: [{ tag: "h1" }],
            toDOM: (node) => ["h1", { class: "title" }, 0],
        };
    }
    get defaultOptions() {
        return {
            handleTitleChange: (title) => document.title = title || "Untitled"
        };
    }
    customNodeView(props) {
        return new title_nodeview_1.default(props);
    }
}
exports.default = Title;
