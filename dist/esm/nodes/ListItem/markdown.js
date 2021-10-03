export const toMarkdown = (state, node) => {
    state.renderContent(node);
};
export const fromMarkdown = () => {
    return { block: "list_item" };
};
