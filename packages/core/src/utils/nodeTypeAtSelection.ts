import { NodeType } from 'prosemirror-model';
import { NodeSelection, Selection } from 'prosemirror-state';

/**
 * `groups` is internal to prosemirror-model. It is not exported.
 * https://github.com/ProseMirror/prosemirror-model/blob/master/src/schema.ts
 */
type NodeTypeWithGroups = NodeType & { groups: readonly string[] };

/**
 * Returns the nodeType at the current selection. Checks for wrapType before blockType.
 * @param selection
 * @returns
 */
export function nodeTypeAtSelection(selection: Selection): NodeType | undefined {
	const { $from, $to } = selection;
	if (!$from.sameParent($to)) return undefined;
	if (selection instanceof NodeSelection) return selection.node.type;
	let type,
		wrapType = $from.depth - 1 ? 1 : 0;
	for (let i = wrapType; i < $from.depth; i++) {
		type = $from.node($from.depth - i).type;
		if ((type as NodeTypeWithGroups).groups.includes('block')) {
			return type;
		}
	}
	return type;
}
