import { Transaction } from "prosemirror-state";
import { ReplaceStep, ReplaceAroundStep } from "prosemirror-transform"

export function hasDocChanged(transactions: Transaction[]) {
  return transactions.reduce((docChanged, tr) => docChanged || tr.docChanged, false);
}

export function hasTextChanged(transactions: Transaction[]) {
  return transactions.some(({steps}) => steps.some((step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep));
}