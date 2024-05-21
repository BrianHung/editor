import { ellipsis, emDash, InputRule } from 'prosemirror-inputrules';
import { Extension } from '../extension.js';

export const leftArrow = new InputRule(/<-$/, '←');
export const rightArrow = new InputRule(/->$/, '→');
export const longLeftArrow = new InputRule(/←-$/, '⟵');
export const longRightArrow = new InputRule(/—>$/, '⟶');

export const Punctuation = (options?: Partial<Extension>) =>
	Extension({
		name: 'punctuation',

		inputRules() {
			return [emDash, ellipsis, leftArrow, rightArrow, longLeftArrow, longRightArrow];
		},

		...options,
	});
