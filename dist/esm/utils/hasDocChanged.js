import { ReplaceStep, ReplaceAroundStep } from "prosemirror-transform";
export function hasDocChanged(transactions) {
    return transactions.reduce((docChanged, tr) => docChanged || tr.docChanged, false);
}
export function hasTextChanged(transactions) {
    return transactions.some(({ steps }) => steps.some((step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep));
}
