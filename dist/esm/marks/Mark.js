import { toggleMark } from "prosemirror-commands";
import Extension from "../extensions/Extension";
export default class Mark extends Extension {
    constructor(options) {
        super(options);
    }
    get type() {
        return "mark";
    }
    commands({ markType, schema }) {
        return () => toggleMark(markType);
    }
    get markdownToken() {
        return "";
    }
    get toMarkdown() {
        return {};
    }
    fromMarkdown() {
        return {};
    }
}
