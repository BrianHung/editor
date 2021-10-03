"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleList = void 0;
const Node_js_1 = require("../../Node.js");
const index_js_1 = require("../../commands/index.js");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const ToggleList = (options) => (0, Node_js_1.Node)(Object.assign({ name: 'togglelist', group: 'block', content: 'toggleitem+', toDOM: () => ['ul', { class: 'toggle-list' }, 0], parseDOM: [{ tag: 'ul.toggle-list' }], commands({ nodeType }) {
        return {
            toggleListType: () => (0, index_js_1.toggleListType)(nodeType)
        };
    },
    inputRules({ nodeType }) {
        return [
            (0, prosemirror_inputrules_1.wrappingInputRule)(/^>>\s$/, nodeType),
        ];
    } }, options));
exports.ToggleList = ToggleList;
