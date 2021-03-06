export const toMarkdown = (state, node) => {
    let start = node.attrs.start || 1;
    let maxW = `${start + node.childCount - 1}`.length;
    let space = state.repeat(" ", maxW + 2);
    state.renderList(node, space, (i) => {
        let nStr = `${start + i}`;
        return state.repeat(" ", maxW - nStr.length) + nStr + ". ";
    });
};
export const fromMarkdown = () => {
    return {
        block: "ordered_list",
        getAttrs: (tok, tokens, i) => ({
            start: +tok.attrGet("start") || 1,
            tight: listIsTight(tokens, i)
        })
    };
};
function listIsTight(tokens, i) {
    while (++i < tokens.length)
        if (tokens[i].type != "list_item_open")
            return tokens[i].hidden;
    return false;
}
