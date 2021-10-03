"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBlock = void 0;
const Node_js_1 = require("../../Node.js");
const keymaps_js_1 = require("./keymaps.js");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_commands_1 = require("prosemirror-commands");
const parserules_js_1 = __importDefault(require("./parserules.js"));
const prosemirror_state_1 = require("prosemirror-state");
const VSCodePaste_js_1 = __importDefault(require("../../plugins/VSCodePaste.js"));
const CodeBlock = (options) => (0, Node_js_1.Node)(Object.assign({ name: "codeblock", attrs: { lang: { default: "" }, lineNumbers: { default: false } }, content: "text*", marks: "", group: "block", code: true, isolating: true, parseDOM: [
        {
            tag: "pre.codeblock",
            preserveWhitespace: "full",
            getAttrs(dom) {
                return { lang: dom.dataset.lang, lineNumbers: dom.dataset.linenumbers !== undefined };
            },
        },
        ...parserules_js_1.default,
    ], toDOM(node) {
        return ["pre", Object.assign(Object.assign({ class: "codeblock" }, node.attrs.lang && { "data-lang": node.attrs.lang }), node.attrs.lineNumbers && { "data-linenumbers": node.attrs.lineNumbers }), ["code", { spellcheck: "false" }, 0]];
    },
    commands({ nodeType }) {
        return {
            codeblock: attrs => (0, prosemirror_commands_1.setBlockType)(nodeType, attrs)
        };
    },
    keymap({ nodeType }) {
        return {
            "Shift-Ctrl-\\": (0, prosemirror_commands_1.setBlockType)(nodeType),
            "Tab": keymaps_js_1.lineIndent,
            "Shift-Tab": keymaps_js_1.lineUndent,
            "Enter": keymaps_js_1.newLine,
            "Ctrl-l": keymaps_js_1.toggleLineNumbers,
            "Ctrl-L": keymaps_js_1.toggleLineNumbers,
            "Backspace": keymaps_js_1.backspaceCodeBlock,
        };
    },
    inputRules({ nodeType }) {
        return [
            (0, prosemirror_inputrules_1.textblockTypeInputRule)(/^```([\w\/+#-.]*)\n$/, nodeType, match => (Object.assign({}, match[1] && { lang: match[1] })))
        ];
    },
    plugins() {
        return [
            VSCodePaste_js_1.default,
            new prosemirror_state_1.Plugin({
                props: {
                    handleDOMEvents: {
                        mousedown(view, event) {
                            const { selection: { $from, $to }, schema } = view.state;
                            return $from.sameParent($to) && $from.parent.type === schema.nodes.codeblock && event.detail === 3;
                        }
                    }
                }
            })
        ];
    } }, options));
exports.CodeBlock = CodeBlock;
