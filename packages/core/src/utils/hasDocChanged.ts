import { Transaction } from 'prosemirror-state';
export function hasDocChanged(tr: Transaction | Transaction[]): boolean {
	return [].concat(tr).some(({ docChanged }) => docChanged);
}
export default hasDocChanged;
