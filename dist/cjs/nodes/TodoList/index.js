"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoList = void 0;
const Node_js_1 = require("../../Node.js");
const index_js_1 = require("../../commands/index.js");
const TodoList = (options) => (0, Node_js_1.Node)(Object.assign({ name: 'todolist', group: 'block', content: 'todoitem+', parseDOM: [{ tag: 'ul.todo-list', priority: 51 }], toDOM() { return ['ul', { class: 'todo-list' }, 0]; },
    commands({ nodeType, schema }) {
        return {
            todolist: () => (0, index_js_1.toggleListType)(nodeType)
        };
    },
    keymap({ nodeType }) {
        return {
            'Shift-Ctrl-3': (0, index_js_1.toggleListType)(nodeType),
        };
    } }, options));
exports.TodoList = TodoList;
