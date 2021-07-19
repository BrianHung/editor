import Node from './Node';
export default class Video extends Node {
    get name() {
        return "video";
    }
    get schema() {
        return {
            content: "source+",
            group: "block",
            parseDOM: [{
                    tag: "video",
                    getAttrs(dom) {
                        console.log("hi");
                        return dom.querySelector("source") ? {} : false;
                    },
                }],
            toDOM() { return ["video", 0]; }
        };
    }
}
