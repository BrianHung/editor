"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changedNodes = exports.changedDescendants = void 0;
function changedDescendants(old, cur, offset, f) {
    let oldSize = old.childCount, curSize = cur.childCount;
    outer: for (let i = 0, j = 0; i < curSize; i++) {
        let child = cur.child(i);
        for (let scan = j, e = Math.min(oldSize, i + 3); scan < e; scan++) {
            if (old.child(scan) == child) {
                j = scan + 1;
                offset += child.nodeSize;
                continue outer;
            }
        }
        f(child, offset);
        if (j < oldSize && old.child(j).sameMarkup(child))
            changedDescendants(old.child(j), child, offset + 1, f);
        else
            child.nodesBetween(0, child.content.size, f, offset + 1);
        offset += child.nodeSize;
    }
}
exports.changedDescendants = changedDescendants;
function changedNodes(tr, f) {
    let ranges = [];
    tr.mapping.maps.forEach(stepMap => {
        ranges = ranges.map(([start, end]) => [stepMap.map(start), stepMap.map(end)]);
        stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => {
            console.log(oldStart, oldEnd, newStart, newEnd, ranges);
            ranges.push([newStart, newEnd]);
        });
    });
    for (let i = 0; i < ranges.length; i++) {
        let [start, end] = ranges[i];
        tr.doc.nodesBetween(start + 1, end, f);
    }
}
exports.changedNodes = changedNodes;
