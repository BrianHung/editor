export const toMarkdown = (state, node, parent, index) => {
    for (let i = index + 1; i < parent.childCount; i++)
        if (parent.child(i).type != node.type) {
            state.write("\\\n");
            return;
        }
};
export const fromMarkdown = () => {
    return { hardbreak: { node: "hard_break" } };
};
