export const toMarkdown = (state, node) => {
    state.write(state.repeat("#", node.attrs.level) + " ");
    state.renderInline(node);
    state.closeBlock(node);
};
export const fromMarkdown = () => {
    return {
        block: "heading",
        getAttrs: tok => ({ level: +tok.tag.slice(1) })
    };
};
