"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trNodeDiff = void 0;
function trNodeDiff(tr) {
    tr.steps.forEach((step, index) => {
        const docPrev = tr.docs[index];
        const docNext = tr.docs[index + 1];
        step.getMap().forEach((oldStart, oldEnd, newStart, newEnd) => {
            const newNodes = [];
            docNext.nodesBetween(newStart, newEnd, newNode => { newNodes.push(newNode); });
            docPrev.nodesBetween(oldStart, oldEnd, oldNode => {
                if (oldNode.type.name === 'hashtag' && !newNodes.includes(oldNode)) {
                    console.log('hash tag deleted', oldNode);
                }
            });
        });
    });
}
exports.trNodeDiff = trNodeDiff;
