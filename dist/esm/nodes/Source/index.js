import { Node } from "../../Node.js";
export const Source = (options) => Node(Object.assign({ name: "source", attrs: { src: { default: undefined }, media: { default: undefined }, type: { default: undefined } }, inline: false, group: "block", parseDOM: [{ tag: "source" }], toDOM(node) { return ["source", Object.assign({}, node.attrs)]; } }, options));
