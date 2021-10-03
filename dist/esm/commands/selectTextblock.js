import { TextSelection } from "prosemirror-state";
export const selectTextblock = (state, dispatch) => {
    let { $cursor } = state.selection;
    if (!$cursor || !$cursor.parent.isTextblock)
        return false;
    if (dispatch) {
        dispatch(state.tr.setSelection(TextSelection.create(state.doc, $cursor.start(), $cursor.end())));
    }
    return true;
};
export default selectTextblock;
