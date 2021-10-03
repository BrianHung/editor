import { Node } from "../../Node.js";
import { lineIndent, lineUndent, newlineIndent, deleteMathBlock } from "./keymaps.js";
import { toggleBlockType } from '../../commands/index.js';
import { textblockTypeInputRule } from 'prosemirror-inputrules';
import { Fragment } from "prosemirror-model";
export const MathBlock = (options) => Node(Object.assign({ name: "mathblock", attrs: { lang: { default: "stex" }, lineNumbers: { default: false } }, content: "text*", marks: "", group: "block", code: true, isolating: true, parseDOM: [
        {
            tag: "pre.mathblock",
            preserveWhitespace: "full"
        },
        {
            tag: "dl",
            getAttrs(dom) {
                if (dom.childElementCount !== 1 || dom.firstChild.tagName !== "DD" || dom.firstChild.childElementCount !== 1 || !dom.firstChild.firstChild.classList.contains("mwe-math-element"))
                    return false;
                return null;
            },
            getContent(dom, schema) {
                let content = dom.querySelector("math").getAttribute("alttext") || dom.querySelector("img.mwe-math-fallback-image-inline").getAttribute("alt");
                return Fragment.from(schema.text(content));
            }
        },
        {
            tag: "div.mwe-math-element",
            getContent(dom, schema) {
                let content = dom.querySelector("math").getAttribute("alttext") || dom.querySelector("img.mwe-math-fallback-image-display").getAttribute("alt");
                return Fragment.from(schema.text(content));
            }
        }
    ], toDOM: (node) => ["pre", { class: "mathblock" }, ["code", { spellcheck: "false" }, 0]], commands({ nodeType }) {
        return {
            mathblock: attrs => toggleBlockType(nodeType, attrs)
        };
    },
    keymap({ nodeType }) {
        return {
            "Tab": lineIndent,
            "Shift-Tab": lineUndent,
            "Enter": newlineIndent,
            "Backspace": deleteMathBlock
        };
    },
    inputRules({ nodeType }) {
        return [
            textblockTypeInputRule(/^\$\$\$$/, nodeType),
            textblockTypeInputRule(/^\$\$\n$/, nodeType),
        ];
    } }, options));
