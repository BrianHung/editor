import type { NodeType } from 'prosemirror-model';
import { liftListItem, wrapInList } from 'prosemirror-schema-list';
import type { Command } from 'prosemirror-state';

/**
 * "It should be possible to implement a list toggle on top of the existing list
 *  commands with very little code—a wrapper command can check whether the
 *  selection is in a list, and calls liftListItem if it is, and wrapInList otherwise."
 *  https://discuss.prosemirror.net/t/list-type-toggle/948/6
 */

export default function toggleListType(listType: NodeType, attrs = null): Command {
	return (state, dispatch) => {
		let { $from, $to } = state.selection;
		let range = $from.blockRange($to);
		if (range == null) return false;

		if (range.depth >= 1) {
			let parentNode = range.$from.node(range.depth - 1),
				parentType = parentNode.type;
			let insideList = parentType.name.includes('list') && range.startIndex == 0;
			if (insideList) {
				if (parentType === listType) {
					let itemType = range.parent.type;
					return liftListItem(itemType)(state, dispatch);
				}

				if (listType.validContent(parentNode.content)) {
					if (dispatch) {
						let parentPos = range.$from.before(range.depth - 1);
						dispatch(state.tr.setNodeMarkup(parentPos, listType));
					}
					return true;
				}

				return false;
			}
		}

		return wrapInList(listType, attrs)(state, dispatch);
	};
}
