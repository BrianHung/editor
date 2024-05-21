import type { NodeType } from 'prosemirror-model';
import type { EditorState, NodeSelection } from 'prosemirror-state';
/**
 * https://github.com/ProseMirror/prosemirror-menu/blob/master/src/menu.ts
 */
export function blockTypeActive(state: EditorState, nodeType: NodeType, attrs = null): boolean {
	let { $from, to, node } = state.selection as NodeSelection;
	if (node) return node.hasMarkup(nodeType, attrs);
	return to <= $from.end() && $from.parent.hasMarkup(nodeType, attrs);
}

export function wrapTypeActive(state: EditorState, nodeType: NodeType, attrs = null): boolean {
	let { $from, to, node } = state.selection as NodeSelection;
	if (node) return node.hasMarkup(nodeType, attrs);
	if (to <= $from.end()) {
		for (let i = 0; i < $from.depth; i++) {
			if ($from.node($from.depth - i).hasMarkup(nodeType, attrs)) return true;
		}
	}
	return false;
}
