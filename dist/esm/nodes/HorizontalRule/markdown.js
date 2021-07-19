export const toMarkdown = (state, node) => {
    state.write(node.attrs.markup || "---");
    state.closeBlock(node);
};
export const fromMarkdown = () => {
    return {
        node: "horizontal_rule"
    };
};
