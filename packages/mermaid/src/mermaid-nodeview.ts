import { classToFunction, copyToClipboard, defineNodeViews } from '@brianhung/editor';
import type { Mermaid } from 'mermaid';
import { Node } from 'prosemirror-model';
import type { Decoration, DecorationSource, EditorView, NodeView } from 'prosemirror-view';

export class MermaidNodeView implements NodeView {
	public node: Node;
	public view: EditorView;
	public getPos: () => number | undefined;

	public dom: HTMLElement;
	public contentDOM: HTMLElement;

	public id: string = window.crypto.randomUUID();
	private mermaid?: Mermaid;
	private render: HTMLElement;

	constructor(
		node: Node,
		view: EditorView,
		getPos: () => number | undefined,
		decorations?: readonly Decoration[],
		innerDecorations?: DecorationSource
	) {
		this.node = node;
		this.view = view;
		this.getPos = getPos;

		// The editor's outer node is our DOM representation
		const dom = document.createElement('div');
		dom.classList.add('codeblock');
		dom.dataset.nodeview = this.node.type.name;
		dom.dataset.language = 'mermaid';
		this.dom = dom;

		const editor = dom.appendChild(document.createElement('pre'));
		editor.classList.add('mermaid-editor');
		const contentDOM = editor.appendChild(document.createElement('code'));
		contentDOM.spellcheck = false;
		this.contentDOM = contentDOM;

		const render = this.dom.appendChild(document.createElement('div'));
		render.classList.add('mermaid-render');
		render.contentEditable = 'false';
		render.onmousedown = event => event.preventDefault();
		render.onclick = () => copyToClipboard(node.textContent);
		render.setAttribute('title', 'click to copy');
		render.setAttribute('aria-label', 'click to copy');
		render.id = `mermaid-${this.id}`;
		render.style.cssText = 'display: flex; flex-direction: row; place-content: center; user-select: none';

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

	private renderContent(text = this.node.textContent) {
		if (this.mermaid) {
			this.mermaid
				.render(`mermaid-diagram-${this.id}`, text, this.render)
				.then(({ svg, bindFunctions }) => {
					this.render.innerHTML = svg;
					bindFunctions?.(this.render);
				})
				.catch(error => {
					const isEmpty = this.node.textContent.trim().length === 0;
					const render = this.render;
					if (isEmpty) {
						render.innerText = 'Empty diagram';
						render.classList.add('mermaid-empty');
					} else {
						render.innerText = error;
						render.classList.add('mermaid-error');
					}
				});
		} else {
			import('mermaid').then(({ default: mermaid }) => {
				this.mermaid = mermaid;
				this.mermaid.initialize({ fontFamily: 'inherit' });
				this.renderContent();
			});
		}
	}
}

export const MermaidNodeViewPlugin = (options = {}) =>
	defineNodeViews({
		mermaid: classToFunction(MermaidNodeView),
	});
