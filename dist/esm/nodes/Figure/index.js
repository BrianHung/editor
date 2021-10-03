import { Node } from "../../Node.js";
export const Figure = (options) => Node(Object.assign({ name: "figure", content: "image+ figcaption?", group: "block", parseDOM: [{
            tag: "figure",
            getAttrs(dom) { return dom.querySelector("img[src]") ? {} : false; },
        }], toDOM() { return ["figure", 0]; } }, options));
