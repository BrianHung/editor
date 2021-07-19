"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
class Video extends Node_1.default {
    get name() {
        return "video";
    }
    get schema() {
        return {
            content: "source+",
            group: "block",
            parseDOM: [{
                    tag: "video",
                    getAttrs(dom) {
                        console.log("hi");
                        return dom.querySelector("source") ? {} : false;
                    },
                }],
            toDOM() { return ["video", 0]; }
        };
    }
}
exports.default = Video;
