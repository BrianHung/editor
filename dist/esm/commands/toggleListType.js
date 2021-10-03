import { wrapInList, liftListItem } from 'prosemirror-schema-list';
export default function toggleListType(listType, attrs = null) {
    return (state, dispatch) => {
        let { $from, $to } = state.selection;
        let range = $from.blockRange($to);
        if (range == null)
            return false;
        if (range.depth >= 1) {
            let parentNode = range.$from.node(range.depth - 1), parentType = parentNode.type;
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
