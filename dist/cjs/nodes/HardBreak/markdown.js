"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromMarkdown = exports.toMarkdown = void 0;
const toMarkdown = (state, node, parent, index) => {
    for (let i = index + 1; i < parent.childCount; i++)
        if (parent.child(i).type != node.type) {
            state.write("\\\n");
            return;
        }
};
exports.toMarkdown = toMarkdown;
const fromMarkdown = () => {
    return { hardbreak: { node: "hard_break" } };
};
exports.fromMarkdown = fromMarkdown;
