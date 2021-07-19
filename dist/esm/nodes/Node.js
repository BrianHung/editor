import Extension from "../extensions/Extension";
export default class Node extends Extension {
    constructor(options) {
        super(options);
    }
    get type() {
        return "node";
    }
}
