import { classToFunction, copyToClipboard, defineNodeViews } from '@brianhung/editor';
import { Node } from 'prosemirror-model';
import type { NodeView } from 'prosemirror-view';
export class MathBlockNodeView implements NodeView {
	public node: Node;
	public dom: HTMLElement;
	public contentDOM: HTMLElement;
	private render: HTMLElement;
	private katex?: typeof import('./katex');

	constructor(node: Node) {
		this.node = node;

		const dom = document.createElement('div');
		dom.classList.add('mathblock');
		dom.dataset.language = 'math';
		this.dom = dom;

		const editor = dom.appendChild(document.createElement('pre'));
		editor.classList.add('katex-editor');
		const contentDOM = editor.appendChild(document.createElement('code'));
		contentDOM.spellcheck = false;
		this.contentDOM = contentDOM;

		const render = dom.appendChild(document.createElement('div'));
		render.classList.add('katex-render');
		render.contentEditable = 'false';
		render.onmousedown = event => event.preventDefault();
		render.onclick = () => copyToClipboard(node.textContent);
		render.setAttribute('title', 'click to copy');
		render.setAttribute('aria-label', 'click to copy');

		this.render = render;
		this.renderContent();
	}

	update(node: Node) {
		if (this.node.type !== node.type) return false;
		this.node.textContent !== node.textContent && this.renderContent(node.textContent);
		this.node = node;
		return true;
	}

	ignoreMutation(mutation: MutationRecord) {
		return this.render.contains(mutation.target);
	}

	renderContent(text = this.node.textContent || '\\text{Mathblock}') {
		if (this.katex) {
			try {
				this.render.innerHTML = this.katex.renderToString(text, {
					displayMode: true,
					throwOnError: true,
				});
				this.render.classList.toggle('katex-error', false);
			} catch (error) {
				const outer = document.createElement('span');
				const inner = outer.appendChild(document.createElement('span'));
				inner.classList.add('katex-error');
				inner.textContent = error.message
					.replace('KaTeX parse error', 'Invalid equation')
					.replace(/\n/g, ' ')
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;');
				this.render.innerHTML = outer.innerHTML;
			}
		} else {
			import('./katex').then(k => {
				this.katex = k;
				this.renderContent();
			});
		}
	}
}

export const MathBlockNodeViewPlugin = (options = {}) =>
	defineNodeViews({
		mathblock: classToFunction(MathBlockNodeView),
	});
