import { Plugin } from "prosemirror-state";
export const VSCodePaste = new Plugin({
    props: {
        handlePaste(view, event, slice) {
            const { dispatch, state: { selection, schema, tr } } = view;
            let vscode = JSON.parse(event.clipboardData.getData("vscode-editor-data") || null);
            if (vscode && selection.$from.parent.type !== schema.nodes.codeblock) {
                let text = event.clipboardData.getData("text/plain");
                dispatch(tr.replaceSelectionWith(schema.node("codeblock", { lang: vscode.mode }, schema.text(text.replace(/\r\n?/g, "\n")))));
                return true;
            }
            return false;
        },
    }
});
export default VSCodePaste;
