"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const commands_1 = require("../../commands");
class TodoList extends Node_1.default {
    get name() {
        return 'todolist';
    }
    get schema() {
        return {
            group: 'block',
            content: 'todoitem+',
            parseDOM: [{ tag: 'ul.todo-list' }],
            toDOM() { return ['ul', { class: 'todo-list' }, 0]; },
        };
    }
    commands({ nodeType, schema }) {
        return () => commands_1.toggleList(nodeType);
    }
    keys({ nodeType }) {
        return {
            'Shift-Ctrl-3': commands_1.toggleList(nodeType),
        };
    }
}
exports.default = TodoList;
