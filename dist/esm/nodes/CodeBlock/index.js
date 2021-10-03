import { Node } from "../../Node.js";
import { lineIndent, lineUndent, newLine, backspaceCodeBlock, toggleLineNumbers } from "./keymaps.js";
import { textblockTypeInputRule } from 'prosemirror-inputrules';
import { setBlockType } from 'prosemirror-commands';
import codeBlockParseRules from "./parserules.js";
import { Plugin } from "prosemirror-state";
import VSCodePaste from '../../plugins/VSCodePaste.js';
export const CodeBlock = (options) => Node(Object.assign({ name: "codeblock", attrs: { lang: { default: "" }, lineNumbers: { default: false } }, content: "text*", marks: "", group: "block", code: true, isolating: true, parseDOM: [
        {
            tag: "pre.codeblock",
            preserveWhitespace: "full",
            getAttrs(dom) {
                return { lang: dom.dataset.lang, lineNumbers: dom.dataset.linenumbers !== undefined };
            },
        },
        ...codeBlockParseRules,
    ], toDOM(node) {
        return ["pre", Object.assign(Object.assign({ class: "codeblock" }, node.attrs.lang && { "data-lang": node.attrs.lang }), node.attrs.lineNumbers && { "data-linenumbers": node.attrs.lineNumbers }), ["code", { spellcheck: "false" }, 0]];
    },
    commands({ nodeType }) {
        return {
            codeblock: attrs => setBlockType(nodeType, attrs)
        };
    },
    keymap({ nodeType }) {
        return {
            "Shift-Ctrl-\\": setBlockType(nodeType),
            "Tab": lineIndent,
            "Shift-Tab": lineUndent,
            "Enter": newLine,
            "Ctrl-l": toggleLineNumbers,
            "Ctrl-L": toggleLineNumbers,
            "Backspace": backspaceCodeBlock,
        };
    },
    inputRules({ nodeType }) {
        return [
            textblockTypeInputRule(/^```([\w\/+#-.]*)\n$/, nodeType, match => (Object.assign({}, match[1] && { lang: match[1] })))
        ];
    },
    plugins() {
        return [
            VSCodePaste,
            new Plugin({
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
