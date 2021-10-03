import { Node } from "../../Node.js";
export const Text = (options) => Node(Object.assign({ name: "text", group: "inline" }, options));
