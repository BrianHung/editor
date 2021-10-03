"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoItem = void 0;
const Node_js_1 = require("../../Node.js");
const prosemirror_schema_list_1 = require("prosemirror-schema-list");
const prosemirror_schema_list_2 = require("prosemirror-schema-list");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const keymaps_js_1 = require("./keymaps.js");
const TodoItem = (options) => (0, Node_js_1.Node)(Object.assign({ name: 'todoitem', attrs: { checked: { default: false } }, content: "paragraph block*", parseDOM: [{ tag: 'li.todo-item', getAttrs: (dom) => ({ checked: dom.dataset.checked === 'true' }), priority: 51 }], toDOM(node) {
        return [
            'li',
            { class: 'todo-item', 'data-checked': node.attrs.checked },
            ['input', Object.assign({ class: 'todo-checkbox', type: 'checkbox', disabled: '' }, node.attrs.checked && { checked: '' })],
            ['div', { class: 'todo-content' }, 0],
        ];
    },
    inputRules({ nodeType }) {
        return [
            (0, prosemirror_inputrules_1.wrappingInputRule)(/^\[(x| )?\]\s$/, nodeType, ([match, checked]) => ({ checked: checked === "x" })),
        ];
    },
    keymap({ nodeType }) {
        return {
            'Ctrl-d': keymaps_js_1.toggleChecked,
            Enter: (0, prosemirror_schema_list_1.splitListItem)(nodeType),
            Tab: (0, prosemirror_schema_list_2.sinkListItem)(nodeType),
            'Shift-Tab': (0, prosemirror_schema_list_2.liftListItem)(nodeType),
            "Mod-[": (0, prosemirror_schema_list_2.liftListItem)(nodeType),
            "Mod-]": (0, prosemirror_schema_list_2.sinkListItem)(nodeType),
        };
    } }, options));
exports.TodoItem = TodoItem;
