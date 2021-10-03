import { Node } from "../../Node.js";
import { nodeInputRule } from '../../utils/index.js';
export const Embed = (options) => Node(Object.assign({ name: 'embed', attrs: { url: { default: null }, alt: { default: null }, title: { default: null }, align: { default: "center" } }, inline: false, group: "block", draggable: true, parseDOM: [{
            tag: 'a.embed',
            getAttrs(a) {
                return { url: a.href };
            }
        }], toDOM(node) {
        return ['a', { class: 'embed', href: node.attrs.url }, node.attrs.url];
    },
    inputRules({ nodeType }) {
        return [
            nodeInputRule(/^embed:([^\s]*)[\s\n]$/, nodeType, match => (Object.assign({}, match[1] && { url: match[1] })))
        ];
    } }, options));
