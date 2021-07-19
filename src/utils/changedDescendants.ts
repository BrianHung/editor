/**
 * Helper for iterating through the nodes in a document that changed compared 
 * to the given previous document. Useful for avoiding duplicate work on each transaction.
 * Source: https://github.com/ProseMirror/prosemirror-tables/blob/master/src/fixtables.js
 */
import type { Node as PMNode } from "prosemirror-model"

export function changedDescendants(old: PMNode, cur: PMNode, offset: number, f: (node: PMNode, pos: number) => void) {
  let oldSize = old.childCount, curSize = cur.childCount
  outer: for (let i = 0, j = 0; i < curSize; i++) {
    let child = cur.child(i)
    for (let scan = j, e = Math.min(oldSize, i + 3); scan < e; scan++) {
      if (old.child(scan) == child) {
        j = scan + 1
        offset += child.nodeSize
        continue outer
      }
    }
    f(child, offset)
    if (j < oldSize && old.child(j).sameMarkup(child))
      changedDescendants(old.child(j), child, offset + 1, f);
    else
      child.nodesBetween(0, child.content.size, f, offset + 1);
    offset += child.nodeSize;
  }
}

import type { Transaction } from "prosemirror-state"

export function changedNodes(tr: Transaction, f: (node: PMNode, pos: number) => void) {
  let ranges: Array<Array<number>> = [];
  tr.mapping.maps.forEach(stepMap => {
    ranges = ranges.map(([start, end]) => [stepMap.map(start), stepMap.map(end)]);
    stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => {
      console.log(oldStart, oldEnd, newStart, newEnd, ranges);
      ranges.push([newStart, newEnd])
    });
  })
  for (let i = 0; i < ranges.length; i++) {
    let [start, end] = ranges[i];
    tr.doc.nodesBetween(start + 1, end, f);
  }
}