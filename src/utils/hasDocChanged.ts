import { Transaction } from "prosemirror-state";
import { ReplaceStep, ReplaceAroundStep } from "prosemirror-transform"

/**
 * Detects if the document has changed at all.
 */
export function hasDocChanged(transactions: Transaction[]) {
  return transactions.reduce((docChanged, tr) => docChanged || tr.docChanged, false);
}

/**
 * Detects if text has been inserted or deleted.
 */
export function hasTextChanged(transactions: Transaction[]) {
  return transactions.some(({steps}) => steps.some((step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep));
}