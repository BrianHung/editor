import { NodeViewProps, removeEmptyValues } from '@brianhung/editor';
import type { Node as PMNode } from 'prosemirror-model';
import type { NodeView } from 'prosemirror-view';

export class ImageNodeView implements NodeView {
	dom: HTMLDivElement;
	contentDOM: HTMLElement;
	node: NodeViewProps['node'];
	view: NodeViewProps['view'];
	getPos: NodeViewProps['getPos'];
	image: HTMLImageElement;
	toolbar: HTMLDivElement;

	constructor(props: NodeViewProps) {
		this.node = props.node;
		this.view = props.view;
		this.getPos = props.getPos;

		this.dom = document.createElement('div');
		this.dom.classList.add('ProseMirror-image-nodeview');
		this.dom.setAttribute('role', 'group');

		const button = this.dom.appendChild(document.createElement('button'));

		button.onmousedown = event => event.preventDefault(); // prevent default behavior of input focus + editor blur
		button.onclick = () => {
			const pos = this.getPos();
			this.view.dispatch(this.view.state.tr.delete(pos, pos + 1));
		};
		button.setAttribute('aria-label', 'Remove media');

		this.image = this.dom.appendChild(document.createElement('img'));
		this.image.loading = 'lazy';
		const { align, ...attrs } = this.node.attrs;
		this.image.dataset.align = align;
		Object.assign(this.image, removeEmptyValues(attrs));

		this.toolbar = this.dom.appendChild(document.createElement('div'));
		this.toolbar.className = 'ProseMirror-image-toolbar';

		const alignments = ['center', 'breakout', 'cover'];
		['center', 'breakout', 'cover'].forEach(alignment => {
			const button = this.toolbar.appendChild(document.createElement('button'));
			button.innerText = alignment;
			button.setAttribute('aria-label', `${alignment} image`);

			// prevent default behavior of button focus + editor blur
			button.onmousedown = event => event.preventDefault();
			button.onclick = event => {
				event.preventDefault();

				let attrs = { ...this.node.attrs };
				if (attrs.align === alignment) {
					delete attrs.align;
				} else {
					attrs.align = alignment;
				}
				console.log('attrs', attrs, attrs.align, attrs.align === alignment);
				this.view.dispatch(this.view.state.tr.setNodeMarkup(this.getPos(), null, attrs));
			};
		});
	}

	update(node: PMNode) {
		if (this.node.type !== node.type) {
			return false;
		}
		this.node = node;
		const { align, ...attrs } = this.node.attrs;
		this.image.dataset.align = align;
		Object.assign(this.image, removeEmptyValues(attrs));
		return true;
	}
}
