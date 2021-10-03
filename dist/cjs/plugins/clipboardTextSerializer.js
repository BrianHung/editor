"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textBetween = void 0;
const prosemirror_state_1 = require("prosemirror-state");
new prosemirror_state_1.Plugin({
    key: new prosemirror_state_1.PluginKey('clipboardTextSerializer'),
    props: {
        clipboardTextSerializer(slice) {
            return slice.content.textBetween(0, slice.content.size, "\n\n");
        }
    }
});
function textBetween(fragment, from, to, blockSeparator, leafText) {
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
exports.textBetween = textBetween;
