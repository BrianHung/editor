import Node from '../Node';
import { lineIndent, lineUndent, newLine, backspaceCodeBlock, toggleLineNumbers } from "./keymaps";
import { textblockTypeInputRule } from 'prosemirror-inputrules';
import { setBlockType } from 'prosemirror-commands';
import codeBlockParseRules from "./parserules";
import { Plugin } from "prosemirror-state";
export default class CodeBlock extends Node {
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
                ...codeBlockParseRules,
            ],
            toDOM(node) {
                return ["pre", Object.assign(Object.assign({ class: "codeblock" }, node.attrs.lang && { "data-lang": node.attrs.lang }), node.attrs.lineNumbers && { "data-linenumbers": node.attrs.lineNumbers }), ["code", { spellcheck: "false" }, 0]];
            },
        };
    }
    commands({ nodeType, schema }) {
        return () => setBlockType(nodeType);
    }
    keys({ nodeType }) {
        return {
            "Shift-Ctrl-\\": setBlockType(nodeType),
            "Tab": lineIndent,
            "Shift-Tab": lineUndent,
            "Enter": newLine,
            "Ctrl-l": toggleLineNumbers,
            "Backspace": backspaceCodeBlock,
        };
    }
    inputRules({ nodeType }) {
        return [
            textblockTypeInputRule(/^```([\w\/+#-.]*)[\s\n]$/, nodeType, match => (Object.assign({}, match[1] && { lang: match[1] })))
        ];
    }
    get plugins() {
        return [
            new Plugin({
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
