export function markActive(state, type) {
    let { from, $from, to, empty } = state.selection;
    if (empty)
        return type.isInSet(state.storedMarks || $from.marks());
    else
        return state.doc.rangeHasMark(from, to, type);
}
