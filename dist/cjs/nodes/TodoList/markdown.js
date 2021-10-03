"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromMarkdown = exports.toMarkdown = void 0;
const toMarkdown = (state, node) => {
    state.renderList(node, "  ", () => node.attrs.checked ? "[x] " : "[ ] ");
};
exports.toMarkdown = toMarkdown;
const fromMarkdown = () => {
    return {
        block: "checkbox_list",
        getAttrs: (tok, tokens, i) => ({ tight: listIsTight(tokens, i) })
    };
};
exports.fromMarkdown = fromMarkdown;
function listIsTight(tokens, i) {
    while (++i < tokens.length)
        if (tokens[i].type != "list_item_open")
            return tokens[i].hidden;
    return false;
}
