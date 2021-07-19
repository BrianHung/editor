"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_schema_list_1 = require("prosemirror-schema-list");
function toggleList(listType) {
    return (state, dispatch) => {
        let { $from, $to } = state.selection;
        let range = $from.blockRange($to);
        if (!range)
            return false;
        console.log("hi");
        let insideList = range.depth >= 2 && range.$from.node(range.depth - 1).type.name.includes("list") && range.startIndex == 0;
        if (insideList) {
            let parentType = range.$from.node(range.depth - 1).type, itemType = range.parent.type;
            if (parentType == listType)
                return prosemirror_schema_list_1.liftListItem(itemType)(state, dispatch);
        }
        return prosemirror_schema_list_1.wrapInList(listType)(state, dispatch);
    };
}
exports.default = toggleList;
