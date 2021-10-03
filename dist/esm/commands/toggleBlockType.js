import { setBlockType } from 'prosemirror-commands';
import { blockTypeActive, defaultBlockAt } from '../utils/index.js';
export default function toggleBlockType(nodeType, attrs = {}) {
    return function (state, dispatch) {
        let active = blockTypeActive(state, nodeType, attrs);
        if (active === false)
            return setBlockType(nodeType, attrs)(state, dispatch);
        let { $head, $anchor } = state.selection;
        let above = $head.node(-1), after = $head.indexAfter(-1), type = defaultBlockAt(above.contentMatchAt(after));
        return setBlockType(type)(state, dispatch);
    };
}
