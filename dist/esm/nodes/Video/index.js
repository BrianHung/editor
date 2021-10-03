import { Node } from "../../Node.js";
export const Video = (options) => Node(Object.assign({ name: "video", content: "source+", group: "block", parseDOM: [{
            tag: "video",
            getAttrs(dom) {
                console.log("Video parseDOM getAttrs", dom);
                return dom.querySelector("source") ? {} : false;
            },
        }], toDOM() { return ["video", 0]; } }, options));
