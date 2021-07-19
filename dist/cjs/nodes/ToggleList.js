"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
const commands_1 = require("../commands");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
class ToggleList extends Node_1.default {
    get name() {
        return 'togglelist';
    }
    get schema() {
        return {
            group: 'block',
            content: 'toggleitem+',
            toDOM: () => ['ul', { class: 'toggle-list' }, 0],
            parseDOM: [{ tag: 'ul.toggle-list' }],
        };
    }
    commands({ nodeType }) {
        return () => commands_1.toggleList(nodeType);
    }
    inputRules({ nodeType }) {
        return [
            prosemirror_inputrules_1.wrappingInputRule(/^>>\s$/, nodeType),
        ];
    }
}
exports.default = ToggleList;
