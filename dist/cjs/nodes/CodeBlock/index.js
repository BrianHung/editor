"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const keymaps_1 = require("./keymaps");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_commands_1 = require("prosemirror-commands");
const parserules_1 = __importDefault(require("./parserules"));
const prosemirror_state_1 = require("prosemirror-state");
class CodeBlock extends Node_1.default {
    get name() {
        return "codeblock";
    }
    get schema() {
        return {
            attrs: { lang: { default: "" }, lineNumbers: { default: false } },
            content: "text*",
            marks: "",
            group: "block",
            code: true,
            isolating: true,
            parseDOM: [
                {
                    tag: "pre.codeblock",
                    preserveWhitespace: "full",
                    getAttrs(dom) {
                        return { lang: dom.dataset.lang, lineNumbers: dom.dataset.linenumbers !== undefined };
                    },
                },
                ...parserules_1.default,
            ],
            toDOM(node) {
                return ["pre", Object.assign(Object.assign({ class: "codeblock" }, node.attrs.lang && { "data-lang": node.attrs.lang }), node.attrs.lineNumbers && { "data-linenumbers": node.attrs.lineNumbers }), ["code", { spellcheck: "false" }, 0]];
            },
        };
    }
    commands({ nodeType, schema }) {
        return () => prosemirror_commands_1.setBlockType(nodeType);
    }
    keys({ nodeType }) {
        return {
            "Shift-Ctrl-\\": prosemirror_commands_1.setBlockType(nodeType),
            "Tab": keymaps_1.lineIndent,
            "Shift-Tab": keymaps_1.lineUndent,
            "Enter": keymaps_1.newLine,
            "Ctrl-l": keymaps_1.toggleLineNumbers,
            "Backspace": keymaps_1.backspaceCodeBlock,
        };
    }
    inputRules({ nodeType }) {
        return [
            prosemirror_inputrules_1.textblockTypeInputRule(/^```([\w\/+#-.]*)[\s\n]$/, nodeType, match => (Object.assign({}, match[1] && { lang: match[1] })))
        ];
    }
    get plugins() {
        return [
            new prosemirror_state_1.Plugin({
                props: {
                    handlePaste(view, event, slice) {
                        let vscode = JSON.parse(event.clipboardData.getData("vscode-editor-data") || null);
                        if (vscode && view.state.selection.$from.parent.type.name !== "codeblock") {
                            const { dispatch, state: { tr, schema } } = view;
                            let content = event.clipboardData.getData("text/plain");
                            dispatch(tr.replaceSelectionWith(schema.node("codeblock", { lang: vscode.mode }, schema.text(content))));
                            return true;
                        }
                        return false;
                    },
                }
            })
        ];
    }
}
exports.default = CodeBlock;
