import { Plugin, PluginKey } from 'prosemirror-state';
/**
 * Detects if pasted text is copied from VSCode, and creates a codeblock with
 * language if selection is not currently in codeblock.
 */
export const VSCodePaste = new Plugin({
	key: new PluginKey('VSCodePaste'),
	props: {
		handlePaste(view, event, slice) {
			const {
				dispatch,
				state: { selection, schema, tr },
			} = view;
			let vscode = JSON.parse(event.clipboardData.getData('vscode-editor-data') || null);
			if (vscode && selection.$from.parent.type !== schema.nodes.codeblock) {
				let text = event.clipboardData.getData('text/plain');
				/**
				 * "Strip carriage return chars from text pasted as code" as we're inserting raw content as text.
				 * https://github.com/ProseMirror/prosemirror-view/commit/a50a6bcceb4ce52ac8fcc6162488d8875613aacd
				 */
				dispatch(
					tr.replaceSelectionWith(
						schema.node('codeblock', { language: vscode.mode }, schema.text(text.replace(/\r\n?/g, '\n')))
					)
				);
				return true;
			}
			return false;
		},
	},
});
export default VSCodePaste;
