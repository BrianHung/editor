export function countWords(state) {
    return state.doc.textContent.split(/\W+/g).filter(Boolean).length;
}
export function countChars(state) {
    return state.doc.textContent.length;
}
