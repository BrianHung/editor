export default function insertText(text = '') {
    return (state, dispatch) => {
        const { $from } = state.selection;
        const { pos } = $from.pos;
        dispatch(state.tr.insertText(text, pos));
        return true;
    };
}
