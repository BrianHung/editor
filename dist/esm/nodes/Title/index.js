import { Node } from "../../Node.js";
export const Title = (options) => Node(Object.assign({ name: "title", content: "inline*", parseDOM: [{ tag: "h1" }], toDOM: (node) => ["h1", { class: "title" }, 0] }, options));
