"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMarkdown = void 0;
const toMarkdown = (state, node) => {
    state.text(node.text);
};
exports.toMarkdown = toMarkdown;
