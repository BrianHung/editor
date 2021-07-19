import type { Transaction } from "prosemirror-state"
import type { Node as PMNode } from "prosemirror-model"

/**
 * https://discuss.prosemirror.net/t/associate-nodes-with-database-entries-inspect-changes/3423/6
 * @param tr 
 */
export function trNodeDiff(tr: Transaction) {
  tr.steps.forEach((step, index) => {

    const docPrev = tr.docs[index];
    const docNext = tr.docs[index+1];

    step.getMap().forEach((oldStart, oldEnd, newStart, newEnd) => {  
      const newNodes: PMNode[] = [];
      docNext.nodesBetween(newStart, newEnd, newNode => { newNodes.push(newNode) })
      docPrev.nodesBetween(oldStart, oldEnd, oldNode => {
        if (oldNode.type.name === 'hashtag' && !newNodes.includes(oldNode)) {
          console.log('hash tag deleted', oldNode)
        }
      })
    });
  })
}