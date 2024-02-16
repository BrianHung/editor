import type { Attrs, NodeType } from 'prosemirror-model';
import type { EditorState, NodeSelection } from 'prosemirror-state';

export function wrapTypeActive(state: EditorState, nodeType: NodeType, attrs?: Attrs | null): boolean {
	let { $from, to, node } = state.selection as NodeSelection;
	if (node) return node.hasMarkup(nodeType, attrs);
	if (to <= $from.end()) {
		for (let i = 0; i < $from.depth; i++) {
			if ($from.node($from.depth - i).hasMarkup(nodeType, withDefault(nodeType, attrs))) return true;
		}
	}
	return false;
}

function withDefault(nodeType: NodeType & { defaultAttrs: Attrs }, attrs?: Attrs | null) {
	return attrs ? { ...nodeType.defaultAttrs, ...attrs } : nodeType.defaultAttrs;
}
