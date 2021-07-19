"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const keymaps_1 = require("./keymaps");
const commands_1 = require("../../commands");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const mathblock_nodeview_1 = __importDefault(require("./mathblock-nodeview"));
const prosemirror_model_1 = require("prosemirror-model");
class MathBlock extends Node_1.default {
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
                        return prosemirror_model_1.Fragment.from(schema.text(content));
                    }
                }, {
                    tag: "div.mwe-math-element",
                    getContent(dom, schema) {
                        let content = dom.querySelector("math").getAttribute("alttext") || dom.querySelector("img.mwe-math-fallback-image-display").getAttribute("alt");
                        return prosemirror_model_1.Fragment.from(schema.text(content));
                    }
                }],
            toDOM: (node) => ["pre", { class: "mathblock" }, ["code", { spellcheck: "false" }, 0]],
        };
    }
    commands({ nodeType, schema }) {
        return () => commands_1.toggleBlockType(nodeType, schema.nodes.paragraph);
    }
    keys({ nodeType }) {
        return {
            "Tab": keymaps_1.lineIndent,
            "Shift-Tab": keymaps_1.lineUndent,
            "Enter": keymaps_1.newlineIndent,
            "Backspace": keymaps_1.deleteMathBlock
        };
    }
    inputRules({ nodeType }) {
        return [
            prosemirror_inputrules_1.textblockTypeInputRule(/^\$\$\$$/, nodeType),
        ];
    }
    customNodeView(props) {
        return new mathblock_nodeview_1.default(props);
    }
}
exports.default = MathBlock;
