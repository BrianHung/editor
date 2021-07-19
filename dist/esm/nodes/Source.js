import Node from "./Node";
export default class Source extends Node {
    get name() {
        return "source";
    }
    get schema() {
        return {
            attrs: { src: { default: undefined }, media: { default: undefined }, type: { default: undefined } },
            inline: false,
            group: "block",
            parseDOM: [{ tag: "source" }],
            toDOM(node) { return ["source", Object.assign({}, node.attrs)]; },
        };
    }
}
