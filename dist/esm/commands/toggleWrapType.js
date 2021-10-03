import { wrapIn, lift } from 'prosemirror-commands';
import { wrapTypeActive } from '../utils/index.js';
export default function toggleWrapType(type, attrs = null) {
    return function (state, dispatch) {
        return wrapTypeActive(state, type, attrs) ? lift(state, dispatch) : wrapIn(type, attrs)(state, dispatch);
    };
}
