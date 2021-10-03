"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockQuote = void 0;
const index_js_1 = require("../../commands/index.js");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_commands_1 = require("prosemirror-commands");
const Node_js_1 = require("../../Node.js");
const BlockQuote = (options) => (0, Node_js_1.Node)(Object.assign({ name: "blockquote", attrs: { type: { default: null } }, content: "block+", group: "block", parseDOM: [{ tag: "blockquote", getAttrs(div) { return { type: div.dataset.type }; } }], toDOM(node) { return ["blockquote", Object.assign({}, node.attrs.type && { 'data-type': node.attrs.type }), 0]; },
    inputRules({ nodeType }) {
        return [
            (0, prosemirror_inputrules_1.wrappingInputRule)(/^> $/, nodeType),
            (0, prosemirror_inputrules_1.wrappingInputRule)(/^" $/, nodeType, { type: "pullquote" })
        ];
    },
    commands({ nodeType }) {
        return {
            "blockquote": attrs => (0, index_js_1.toggleWrapType)(nodeType, attrs),
            "pullquote": () => (0, index_js_1.toggleWrapType)(nodeType, { type: "pullquote" }),
        };
    },
    keymap({ nodeType }) {
        return {
            'Ctrl->': (0, prosemirror_commands_1.wrapIn)(nodeType),
            'Ctrl-"': (0, prosemirror_commands_1.wrapIn)(nodeType, { type: "pullquote" })
        };
    } }, options));
exports.BlockQuote = BlockQuote;
