"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const prosemirror_schema_list_1 = require("prosemirror-schema-list");
class ListItem extends Node_1.default {
    get name() {
        return 'listitem';
    }
    get schema() {
        return {
            content: 'paragraph block*',
            defining: true,
            draggable: false,
            parseDOM: [{ tag: 'li' }],
            toDOM(node) { return ['li', { class: "list-item" }, 0]; },
        };
    }
    keys({ nodeType }) {
        return {
            Enter: prosemirror_schema_list_1.splitListItem(nodeType),
            Tab: prosemirror_schema_list_1.sinkListItem(nodeType),
            'Shift-Tab': prosemirror_schema_list_1.liftListItem(nodeType),
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
            "Mod-[": prosemirror_schema_list_1.liftListItem(nodeType),
            "Mod-]": prosemirror_schema_list_1.sinkListItem(nodeType),
        };
    }
}
exports.default = ListItem;
