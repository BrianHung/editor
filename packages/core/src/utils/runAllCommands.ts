import { Command, Transaction } from 'prosemirror-state';

/**
 * Combine a number of command functions into a single function (which
 * calls them one by one until one returns false).
 *
 * All commands are undone with a single undo action.
 *
 * TODO: Figure out how https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/CommandManager.ts
 * works to avoid multiple dispatches / to dispatch once with a single end state.
 */
export function runAllCommands(...commands: readonly Command[]): Command {
	return function (initState, dispatch, view) {
		let state = initState;
		const tx: Transaction[] = [];
		for (let i = 0; i < commands.length; i++) {
			const dispatchInner = (transaction: Transaction) => {
				if (i > 0) transaction.setMeta('appendedTransaction', tx.at(i - 1));
				const { state: nextState } = state.applyTransaction(transaction);
				state = nextState;
				tx.push(transaction);
			};
			if (!commands[i](state, dispatchInner, view)) return false;
		}
		// Only dispatch last transaction if all commands succeed.
		// Last transaction contains all previous transactions.
		if (dispatch) {
			tx.forEach(dispatch);
		}
		return true;
	};
}
