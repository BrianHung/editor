"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleItem = void 0;
const Node_js_1 = require("../../Node.js");
const prosemirror_schema_list_1 = require("prosemirror-schema-list");
const prosemirror_schema_list_2 = require("prosemirror-schema-list");
const toggle_nodeview_js_1 = __importDefault(require("./toggle-nodeview.js"));
const keymaps_js_1 = require("./keymaps.js");
const ToggleItem = (options) => (0, Node_js_1.Node)(Object.assign({ name: "toggleitem", attrs: { checked: { default: false } }, content: "paragraph block*", parseDOM: [{
            tag: 'li.toggle-item',
            getAttrs: (dom) => ({ checked: dom.dataset.toggled === 'true' }),
        }], toDOM(node) {
        return [
            'li',
            { class: "toggle-item", 'data-toggled': node.attrs.checked },
            ['input', { class: 'toggle-checkbox', type: 'checkbox' }],
            ['div', { class: 'toggle-content' }, 0],
        ];
    },
    keymap({ nodeType }) {
        return {
            'Ctrl-l': keymaps_js_1.toggleToggled,
            Enter: (0, prosemirror_schema_list_1.splitListItem)(nodeType),
            Tab: (0, prosemirror_schema_list_2.sinkListItem)(nodeType),
            'Shift-Tab': (0, prosemirror_schema_list_2.liftListItem)(nodeType),
        };
    },
    nodeView(props) {
        return new toggle_nodeview_js_1.default(props);
    } }, options));
exports.ToggleItem = ToggleItem;
