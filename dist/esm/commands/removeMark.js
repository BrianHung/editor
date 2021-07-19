import { getMarkRange } from '../utils';
export default function removeMark(type) {
    return (state, dispatch) => {
        const { tr, selection } = state;
        let { from, to } = selection;
        const { $from, empty } = selection;
        if (empty) {
            const range = getMarkRange($from, type);
            if (range == false)
                return null;
            from = range.from;
            to = range.to;
        }
        tr.removeMark(from, to, type);
        return dispatch(tr);
    };
}
