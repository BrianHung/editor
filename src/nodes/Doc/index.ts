import { Node } from "../../Node.js";
// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
export const Doc = (options?: Partial<Node>) => Node({
  name: "doc",
  content: "block+",
  marks: "link",
  ...options,
})