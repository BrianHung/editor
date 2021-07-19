import Node from "../Node";
import { nodeInputRule } from '../../commands';
export default class Embed extends Node {
    get name() {
        return "embed";
    }
    get schema() {
        return {
            attrs: { url: { default: null }, alt: { default: null }, title: { default: null }, align: { default: "center" } },
            inline: false,
            group: "block",
            draggable: true,
            parseDOM: [{
                    tag: 'a.embed',
                    getAttrs(a) {
                        return { url: a.href };
                    }
                }],
            toDOM(node) {
                return ['a', { class: 'embed', href: node.attrs.url }, node.attrs.url];
            }
        };
    }
    inputRules({ nodeType }) {
        return [
            nodeInputRule(/^embed:([^\s]*)[\s\n]$/, nodeType, match => (Object.assign({}, match[1] && { url: match[1] })))
        ];
    }
}
