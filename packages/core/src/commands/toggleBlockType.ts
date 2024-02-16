import { setBlockType } from 'prosemirror-commands';
import type { NodeType } from 'prosemirror-model';
import type { Command } from 'prosemirror-state';
import { blockTypeActive, defaultBlockAt } from '../utils/index.js';
/**
 * Use `defaultBlockAt` to find type.
 * https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js
 */
export default function toggleBlockType(nodeType: NodeType, attrs = {}): Command {
	return function (state, dispatch) {
		let active = blockTypeActive(state, nodeType, attrs);
		if (active === false) return setBlockType(nodeType, attrs)(state, dispatch);
		let { $head, $anchor } = state.selection;
		let above = $head.node(-1),
			after = $head.indexAfter(-1),
			type = defaultBlockAt(above.contentMatchAt(after));
		return setBlockType(type)(state, dispatch);
	};
}
