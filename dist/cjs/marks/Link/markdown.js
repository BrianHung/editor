"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromMarkdown = exports.toMarkdown = void 0;
exports.toMarkdown = {
    open(_state, mark, parent, index) {
        return isPlainURL(mark, parent, index, 1) ? "<" : "[";
    },
    close(state, mark, parent, index) {
        return isPlainURL(mark, parent, index, -1) ? ">" : "]("
            + state.esc(mark.attrs.href) + (mark.attrs.title ? " " + state.quote(mark.attrs.title) : "") + ")";
    },
};
exports.fromMarkdown = {
    mark: "link",
    getAttrs: tok => ({
        href: tok.attrGet("href"),
        title: tok.attrGet("title") || null
    }),
};
function isPlainURL(link, parent, index, side) {
    if (link.attrs.title || !/^\w+:/.test(link.attrs.href))
        return false;
    const content = parent.child(index + (side < 0 ? -1 : 0));
    if (!content.isText || content.text != link.attrs.href || content.marks[content.marks.length - 1] != link)
        return false;
    if (index == (side < 0 ? 1 : parent.childCount - 1))
        return true;
    const next = parent.child(index + (side < 0 ? -2 : 1));
    return !link.isInSet(next.marks);
}
