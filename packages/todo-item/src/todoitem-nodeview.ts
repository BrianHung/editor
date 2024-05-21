import { defineNodeViews } from '@brianhung/editor';
import type { NodeViewConstructor } from 'prosemirror-view';

export const TodoItemNodeView: NodeViewConstructor = (node, view, getPos) => {
	const dom = document.createElement('li');
	dom.classList.add('todo-item');

	const checkbox = dom.appendChild(document.createElement('input'));
	checkbox.classList.add('todo-checkbox');
	checkbox.type = 'checkbox';
	checkbox.tabIndex = -1; // remove checkbox from tab navigation because it's contained within editor
	checkbox.onmousedown = event => event.preventDefault(); // prevent default behavior of input focus + editor blur
	checkbox.onclick = event => {
		const checked = (event.target as HTMLInputElement).checked;
		const pos = getPos();
		if (pos !== undefined) {
			const tr = view.state.tr;
			const node = tr.doc.nodeAt(pos);
			view.dispatch(tr.setNodeMarkup(pos, null, { ...node?.attrs, checked }));
		}
	};

	dom.dataset.checked = checkbox.checked = node.attrs.checked;
	checkbox.toggleAttribute('checked', node.attrs.checked);

	const contentDOM = dom.appendChild(document.createElement('div'));
	contentDOM.classList.add('todo-content');

	return {
		dom,
		contentDOM,
		update: _node => {
			if (_node.type !== node.type) return false;
			dom.dataset.checked = checkbox.checked = _node.attrs.checked;
			checkbox.toggleAttribute('checked', _node.attrs.checked);
			node = _node;
			return true;
		},
	};
};

export const TodoItemNodeViewPlugin = (options = {}) =>
	defineNodeViews({
		todoitem: TodoItemNodeView,
	});
