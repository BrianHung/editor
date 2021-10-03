import { Node } from "../../Node.js"
export const Video = (options?: Partial<Node>) => Node({
  name: "video",

  content: "source+",
  group: "block",
  parseDOM: [{
    tag: "video",
    getAttrs(dom: HTMLElement) {
      console.log("Video parseDOM getAttrs", dom)
      return dom.querySelector("source") ? {} : false; // check for a source element
    }, 
  }],
  toDOM() { return ["video", 0] },

  ...options
})
