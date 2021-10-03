"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemList = void 0;
const Node_js_1 = require("../../Node.js");
const index_js_1 = require("../../commands/index.js");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const ItemList = (options) => (0, Node_js_1.Node)(Object.assign({ name: 'itemlist', content: 'listitem+', group: 'block', parseDOM: [{ tag: 'ul' }], toDOM(node) { return ['ul', { class: "item-list" }, 0]; },
    commands({ nodeType }) {
        return {
            itemlist: () => (0, index_js_1.toggleListType)(nodeType)
        };
    },
    keymap({ nodeType }) {
        return {
            'Shift-Ctrl-2': (0, index_js_1.toggleListType)(nodeType),
        };
    },
    inputRules({ nodeType }) {
        return [
            (0, prosemirror_inputrules_1.wrappingInputRule)(/^([-+*])\s$/, nodeType),
        ];
    } }, options));
exports.ItemList = ItemList;
