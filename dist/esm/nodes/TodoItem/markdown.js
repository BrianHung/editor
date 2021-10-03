export const toMarkdown = (state, node) => {
    state.write(node.attrs.checked ? "[x] " : "[ ] ");
    state.renderContent(node);
};
export const fromMarkdown = () => {
    return {
        block: "checkbox_item",
        getAttrs: (tok) => ({ checked: !!tok.attrGet("checked") }),
    };
};
