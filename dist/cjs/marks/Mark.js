"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const Extension_1 = __importDefault(require("../extensions/Extension"));
class Mark extends Extension_1.default {
    constructor(options) {
        super(options);
    }
    get type() {
        return "mark";
    }
    commands({ markType, schema }) {
        return () => prosemirror_commands_1.toggleMark(markType);
    }
    get markdownToken() {
        return "";
    }
    get toMarkdown() {
        return {};
    }
    fromMarkdown() {
        return {};
    }
}
exports.default = Mark;
