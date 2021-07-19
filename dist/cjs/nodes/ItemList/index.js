"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const commands_1 = require("../../commands");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const commands_2 = require("../../commands");
class ItemList extends Node_1.default {
    get name() {
        return 'itemlist';
    }
    get schema() {
        return {
            content: 'listitem+',
            group: 'block',
            parseDOM: [{ tag: 'ul' }],
            toDOM(node) { return ['ul', { class: "item-list" }, 0]; },
            draggable: true,
        };
    }
    commands({ nodeType }) {
        return () => commands_1.toggleList(nodeType);
    }
    keys({ nodeType }) {
        return {
            'Shift-Ctrl-2': commands_1.toggleList(nodeType),
        };
    }
    inputRules({ nodeType }) {
        return [
            commands_2.listInputRule(/^([-+*])\s$/, nodeType),
            prosemirror_inputrules_1.wrappingInputRule(/^([-+*])\s$/, nodeType),
        ];
    }
}
exports.default = ItemList;
