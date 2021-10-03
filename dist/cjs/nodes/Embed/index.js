"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embed = void 0;
const Node_js_1 = require("../../Node.js");
const index_js_1 = require("../../utils/index.js");
const Embed = (options) => (0, Node_js_1.Node)(Object.assign({ name: 'embed', attrs: { url: { default: null }, alt: { default: null }, title: { default: null }, align: { default: "center" } }, inline: false, group: "block", draggable: true, parseDOM: [{
            tag: 'a.embed',
            getAttrs(a) {
                return { url: a.href };
            }
        }], toDOM(node) {
        return ['a', { class: 'embed', href: node.attrs.url }, node.attrs.url];
    },
    inputRules({ nodeType }) {
        return [
            (0, index_js_1.nodeInputRule)(/^embed:([^\s]*)[\s\n]$/, nodeType, match => (Object.assign({}, match[1] && { url: match[1] })))
        ];
    } }, options));
exports.Embed = Embed;
