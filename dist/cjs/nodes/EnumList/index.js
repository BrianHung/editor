"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumList = void 0;
const Node_js_1 = require("../../Node.js");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const index_js_1 = require("../../commands/index.js");
const EnumList = (options) => (0, Node_js_1.Node)(Object.assign({ name: 'enumlist', attrs: { start: { default: 1 } }, content: 'listitem+', group: 'block', parseDOM: [{ tag: "ol", getAttrs(dom) { return { start: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1 }; } }], toDOM(node) { return ['ol', { class: "enum-list", start: node.attrs.start }, 0]; },
    commands({ nodeType }) {
        return {
            enumlist: () => (0, index_js_1.toggleListType)(nodeType)
        };
    },
    keymap({ nodeType }) {
        return {
            'Shift-Ctrl-1': (0, index_js_1.toggleListType)(nodeType),
        };
    },
    inputRules({ nodeType }) {
        return [
            (0, prosemirror_inputrules_1.wrappingInputRule)(/^(\d+)\.\s$/, nodeType, ([match, start]) => ({ start: +start }), ([match, start], node) => node.childCount + node.attrs.start === +start),
        ];
    } }, options));
exports.EnumList = EnumList;
