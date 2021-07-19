import Node from './Node';
export default class Figure extends Node {
    get name() {
        return "figure";
    }
    get schema() {
        return {
            content: "image+ figcaption?",
            group: "block",
            parseDOM: [{
                    tag: "figure",
                    getAttrs(dom) {
                        return dom.querySelector("img[src]") ? {} : false;
                    },
                }],
            toDOM() {
                return ["figure", 0];
            }
        };
    }
}
