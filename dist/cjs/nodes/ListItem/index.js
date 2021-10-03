"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItem = void 0;
const Node_js_1 = require("../../Node.js");
const prosemirror_schema_list_1 = require("prosemirror-schema-list");
const ListItem = (options) => (0, Node_js_1.Node)(Object.assign({ name: 'listitem', content: 'paragraph block*', defining: true, parseDOM: [{ tag: 'li' }], toDOM(node) { return ['li', { class: "list-item" }, 0]; },
    keymap({ nodeType }) {
        return {
            Enter: (0, prosemirror_schema_list_1.splitListItem)(nodeType),
            Tab: (0, prosemirror_schema_list_1.sinkListItem)(nodeType),
            'Shift-Tab': (0, prosemirror_schema_list_1.liftListItem)(nodeType),
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
            "Mod-[": (0, prosemirror_schema_list_1.liftListItem)(nodeType),
            "Mod-]": (0, prosemirror_schema_list_1.sinkListItem)(nodeType),
        };
    } }, options));
exports.ListItem = ListItem;
