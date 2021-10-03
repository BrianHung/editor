import { Node } from "../../Node.js";
export const Doc = (options) => Node(Object.assign({ name: "doc", content: "block+", marks: "link" }, options));
