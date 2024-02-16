import { Transaction } from 'prosemirror-state';
import { ReplaceAroundStep, ReplaceStep } from 'prosemirror-transform';
export function hasTextChanged(tr: Transaction | Transaction[]): boolean {
	return []
		.concat(tr)
		.some(({ steps }) => steps.some(step => step instanceof ReplaceStep || step instanceof ReplaceAroundStep));
}
export default hasTextChanged;
