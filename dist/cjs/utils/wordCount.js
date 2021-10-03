"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countChars = exports.countWords = void 0;
function countWords(state) {
    return state.doc.textContent.split(/\W+/g).filter(Boolean).length;
}
exports.countWords = countWords;
function countChars(state) {
    return state.doc.textContent.length;
}
exports.countChars = countChars;
