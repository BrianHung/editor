import { Attrs, NodeType } from 'prosemirror-model';
import { EditorState, NodeSelection } from 'prosemirror-state';

/**
 * A blockType is a nodeType where isBlock is true.
 * Checks if selected node is of a certain nodeType and attrs. Uses node selection first then text selection.
 * https://github.com/ProseMirror/prosemirror-menu/blob/master/src/menu.ts
 * @param state
 * @param nodeType
 * @param attrs
 * @returns
 */
export function blockTypeActive(state: EditorState, nodeType: NodeType, attrs?: Attrs | null) {
	let { $from, to, node } = state.selection as NodeSelection;
	if (node) return node.hasMarkup(nodeType, attrs);
	return (
		to <= $from.end() &&
		(attrs ? $from.parent.hasMarkup(nodeType, withDefault(nodeType, attrs)) : $from.parent.type == nodeType)
	);
}

function withDefault(nodeType: NodeType & { defaultAttrs: Attrs }, attrs?: Attrs | null) {
	return attrs ? { ...nodeType.defaultAttrs, ...attrs } : nodeType.defaultAttrs;
}
