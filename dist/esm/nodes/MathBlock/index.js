import Node from '../Node';
import { lineIndent, lineUndent, newlineIndent, deleteMathBlock } from "./keymaps";
import { toggleBlockType } from '../../commands';
import { textblockTypeInputRule } from 'prosemirror-inputrules';
import MathBlockNodeView from "./mathblock-nodeview";
import { Fragment } from "prosemirror-model";
export default class MathBlock extends Node {
    get name() {
        return "mathblock";
    }
    get schema() {
        return {
            attrs: { lang: { default: "stex" }, lineNumbers: { default: false } },
            content: "text*",
            marks: "",
            group: "block",
            code: true,
            isolating: true,
            parseDOM: [{
                    tag: "pre.mathblock",
                    preserveWhitespace: "full"
                }, {
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
                }, {
                    tag: "div.mwe-math-element",
                    getContent(dom, schema) {
                        let content = dom.querySelector("math").getAttribute("alttext") || dom.querySelector("img.mwe-math-fallback-image-display").getAttribute("alt");
                        return Fragment.from(schema.text(content));
                    }
                }],
            toDOM: (node) => ["pre", { class: "mathblock" }, ["code", { spellcheck: "false" }, 0]],
        };
    }
    commands({ nodeType, schema }) {
        return () => toggleBlockType(nodeType, schema.nodes.paragraph);
    }
    keys({ nodeType }) {
        return {
            "Tab": lineIndent,
            "Shift-Tab": lineUndent,
            "Enter": newlineIndent,
            "Backspace": deleteMathBlock
        };
    }
    inputRules({ nodeType }) {
        return [
            textblockTypeInputRule(/^\$\$\$$/, nodeType),
        ];
    }
    customNodeView(props) {
        return new MathBlockNodeView(props);
    }
}
