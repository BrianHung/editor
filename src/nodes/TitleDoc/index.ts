import { Node } from "../../Node.js";
export const TitleDoc = (options?: Partial<Node>) => Node({
  name: 'titledoc',
  content: 'title block+',
  ...options,
})