import { Node } from "../../Node.js";
import { splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list';
export const ListItem = (options) => Node(Object.assign({ name: 'listitem', content: 'paragraph block*', defining: true, parseDOM: [{ tag: 'li' }], toDOM(node) { return ['li', { class: "list-item" }, 0]; },
    keymap({ nodeType }) {
        return {
            Enter: splitListItem(nodeType),
            Tab: sinkListItem(nodeType),
            'Shift-Tab': liftListItem(nodeType),
            'Shift-Enter': (state, dispatch) => {
                let { $from, $to, node } = state.selection;
                if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to))
                    return false;
                let grandParent = $from.node(-1);
                if (grandParent.type != nodeType)
                    return false;
                let tr = state.tr.delete($from.pos, $to.pos);
                dispatch(tr.split($from.pos));
                return true;
            },
            "Mod-[": liftListItem(nodeType),
            "Mod-]": sinkListItem(nodeType),
        };
    } }, options));
