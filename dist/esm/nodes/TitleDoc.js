import Node from "./Node";
export default class TitleDoc extends Node {
    get name() {
        return "titledoc";
    }
    get schema() {
        return {
            content: "title block+",
        };
    }
}
