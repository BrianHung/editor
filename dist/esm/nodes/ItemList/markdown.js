export const toMarkdown = (state, node) => {
    state.renderList(node, "  ", () => (node.attrs.bullet || "-") + " ");
};
export const fromMarkdown = () => {
    return {
        block: "bullet_list",
        getAttrs: (tok, tokens, i) => ({ tight: listIsTight(tokens, i) })
    };
};
function listIsTight(tokens, i) {
    while (++i < tokens.length)
        if (tokens[i].type != "list_item_open")
            return tokens[i].hidden;
    return false;
}
