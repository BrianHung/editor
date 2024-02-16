import { Plugin, PluginKey } from 'prosemirror-state';
/**
 * Plugin which allows nodes and marks to customize their serialization to text
 * using custom `toText` field in node and mark spec.
 * https://discuss.prosemirror.net/t/replace-image-with-text-on-text-copy/3518/6
 * https://prosemirror.net/docs/ref/#view.EditorProps.clipboardTextSerializer
 * https://github.com/ProseMirror/prosemirror-view/blob/master/src/clipboard.js
 */
new Plugin({
	key: new PluginKey('clipboardTextSerializer'),
	props: {
		clipboardTextSerializer(slice) {
			return slice.content.textBetween(0, slice.content.size, '\n\n');
		},
	},
});

/**
 * `Fragment.textBetween`
 * https://github.com/ProseMirror/prosemirror-model/blob/master/src/fragment.js
 */
export function textBetween(fragment, from, to, blockSeparator, leafText) {
	let text = '',
		separated = true;
	fragment.nodesBetween(
		from,
		to,
		(node, pos) => {
			if (node.isText) {
				text += node.text.slice(Math.max(from, pos) - pos, to - pos);
				separated = !blockSeparator;
			} else if (node.isLeaf && leafText) {
				text += leafText;
				separated = !blockSeparator;
			} else if (!separated && node.isBlock) {
				text += blockSeparator;
				separated = true;
			}
		},
		0
	);
	return text;
}
