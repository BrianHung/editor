import { lift, wrapIn } from 'prosemirror-commands';
import type { NodeType } from 'prosemirror-model';
import type { Command } from 'prosemirror-state';
import { wrapTypeActive } from '../utils/index.js';
export default function toggleWrapType(type: NodeType, attrs = null): Command {
	return function (state, dispatch) {
		return wrapTypeActive(state, type, attrs) ? lift(state, dispatch) : wrapIn(type, attrs)(state, dispatch);
	};
}
