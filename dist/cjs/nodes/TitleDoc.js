"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
class TitleDoc extends Node_1.default {
    get name() {
        return "titledoc";
    }
    get schema() {
        return {
            content: "title block+",
        };
    }
}
exports.default = TitleDoc;
