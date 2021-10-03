"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToken = exports.fromMarkdown = exports.toMarkdown = void 0;
exports.toMarkdown = {
    open: "~~",
    close: "~~",
    mixable: true,
    expelEnclosingWhitespace: true,
};
exports.fromMarkdown = {
    mark: "strikethrough"
};
exports.markdownToken = "s";
