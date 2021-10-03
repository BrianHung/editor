export const toMarkdown = (state, node) => {
    state.wrapBlock("> ", null, node, () => state.renderContent(node));
};
export const fromMarkdown = () => {
    return { block: "blockquote" };
};
