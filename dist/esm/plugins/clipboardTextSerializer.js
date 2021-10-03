import { Plugin, PluginKey } from 'prosemirror-state';
new Plugin({
    key: new PluginKey('clipboardTextSerializer'),
    props: {
        clipboardTextSerializer(slice) {
            return slice.content.textBetween(0, slice.content.size, "\n\n");
        }
    }
});
export function textBetween(fragment, from, to, blockSeparator, leafText) {
    let text = "", separated = true;
    fragment.nodesBetween(from, to, (node, pos) => {
        if (node.isText) {
            text += node.text.slice(Math.max(from, pos) - pos, to - pos);
            separated = !blockSeparator;
        }
        else if (node.isLeaf && leafText) {
            text += leafText;
            separated = !blockSeparator;
        }
        else if (!separated && node.isBlock) {
            text += blockSeparator;
            separated = true;
        }
    }, 0);
    return text;
}
