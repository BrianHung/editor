"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathBlock = void 0;
const Node_js_1 = require("../../Node.js");
const keymaps_js_1 = require("./keymaps.js");
const index_js_1 = require("../../commands/index.js");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_model_1 = require("prosemirror-model");
const MathBlock = (options) => (0, Node_js_1.Node)(Object.assign({ name: "mathblock", attrs: { lang: { default: "stex" }, lineNumbers: { default: false } }, content: "text*", marks: "", group: "block", code: true, isolating: true, parseDOM: [
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
                return prosemirror_model_1.Fragment.from(schema.text(content));
            }
        },
        {
            tag: "div.mwe-math-element",
            getContent(dom, schema) {
                let content = dom.querySelector("math").getAttribute("alttext") || dom.querySelector("img.mwe-math-fallback-image-display").getAttribute("alt");
                return prosemirror_model_1.Fragment.from(schema.text(content));
            }
        }
    ], toDOM: (node) => ["pre", { class: "mathblock" }, ["code", { spellcheck: "false" }, 0]], commands({ nodeType }) {
        return {
            mathblock: attrs => (0, index_js_1.toggleBlockType)(nodeType, attrs)
        };
    },
    keymap({ nodeType }) {
        return {
            "Tab": keymaps_js_1.lineIndent,
            "Shift-Tab": keymaps_js_1.lineUndent,
            "Enter": keymaps_js_1.newlineIndent,
            "Backspace": keymaps_js_1.deleteMathBlock
        };
    },
    inputRules({ nodeType }) {
        return [
            (0, prosemirror_inputrules_1.textblockTypeInputRule)(/^\$\$\$$/, nodeType),
            (0, prosemirror_inputrules_1.textblockTypeInputRule)(/^\$\$\n$/, nodeType),
        ];
    } }, options));
exports.MathBlock = MathBlock;
