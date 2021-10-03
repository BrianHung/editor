export const toMarkdown = (state, node) => {
    let alt = state.esc(node.attrs.alt || "");
    let src = state.esc(node.attrs.src) + (node.attrs.title ? " " + state.quote(node.attrs.title) : "");
    state.write(`![${alt}](${src})`);
};
export const fromMarkdown = () => {
    return {
        node: "image",
        getAttrs: tok => ({
            src: tok.attrGet("src"),
            title: tok.attrGet("title") || null,
            alt: tok.children[0] && tok.children[0].content || null
        }),
    };
};
