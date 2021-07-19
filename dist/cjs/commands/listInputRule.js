"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_transform_1 = require("prosemirror-transform");
const prosemirror_model_1 = require("prosemirror-model");
function listInputRule(regex, listType, getAttrs, joinPredicate) {
    return new prosemirror_inputrules_1.InputRule(regex, (state, match, start, end) => {
        let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
        let tr = state.tr.delete(start, end);
        let $start = tr.doc.resolve(start), range = $start.blockRange();
        let shallowInside = range.depth >= 2 && range.$from.node(range.depth - 1).type.name.includes("list") && range.startIndex == 0;
        if (!shallowInside)
            return null;
        let itemType = range.parent.type, $from, $to, item;
        $from = $to = $start;
        range = $from.blockRange($to, node => node.childCount && node.firstChild.type == itemType);
        if (!range)
            return null;
        let list = range.parent;
        for (let pos = range.end, i = range.endIndex - 1, e = range.startIndex; i > e; i--) {
            pos -= list.child(i).nodeSize;
            tr.delete(pos - 1, pos + 1);
        }
        $start = tr.doc.resolve(range.start), item = $start.nodeAfter;
        let atStart = range.startIndex == 0, atEnd = range.endIndex == list.childCount;
        let parent = $start.node(-1), indexBefore = $start.index(-1);
        if (!parent.canReplace(indexBefore + (atStart ? 0 : 1), indexBefore + 1, item.content.append(atEnd ? prosemirror_model_1.Fragment.empty : prosemirror_model_1.Fragment.from(list))))
            return null;
        start = $start.pos, end = start + item.nodeSize;
        tr.step(new prosemirror_transform_1.ReplaceAroundStep(start - (atStart ? 1 : 0), end + (atEnd ? 1 : 0), start + 1, end - 1, new prosemirror_model_1.Slice((atStart ? prosemirror_model_1.Fragment.empty : prosemirror_model_1.Fragment.from(list.copy(prosemirror_model_1.Fragment.empty))).append(atEnd ? prosemirror_model_1.Fragment.empty : prosemirror_model_1.Fragment.from(list.copy(prosemirror_model_1.Fragment.empty))), atStart ? 0 : 1, atEnd ? 0 : 1), atStart ? 0 : 1));
        $from = tr.doc.resolve(start + (atStart ? 0 : 2)), $to = tr.doc.resolve(end - 1 - (atStart ? 2 : 0));
        range = $from.blockRange($to);
        if (!range)
            return null;
        let wrapping = range && prosemirror_transform_1.findWrapping(range, listType, attrs);
        if (!wrapping)
            return null;
        tr.wrap(range, wrapping);
        let before = tr.doc.resolve(start - 1).nodeBefore;
        if (before && (before.type == listType || (before.lastChild && before.lastChild.type == listType)) && prosemirror_transform_1.canJoin(tr.doc, start - 1) &&
            (!joinPredicate || joinPredicate(match, before)))
            tr.join(start - 1);
        return tr;
    });
}
exports.default = listInputRule;
