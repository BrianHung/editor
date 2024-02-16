import type { NodeViewProps } from '@brianhung/editor';
import type { Node as PMNode } from 'prosemirror-model';
import type { NodeView } from 'prosemirror-view';

export class HeadingView implements NodeView {
	dom: HTMLElement;
	contentDOM: HTMLElement;
	node: PMNode;
	options: any;

	constructor(props: NodeViewProps, options) {
		this.options = options;
		this.node = props.node;
		this.dom = this.contentDOM = document.createElement(`h${this.node.attrs.level}`);
		this.options.modifyDOM && this.options.modifyDOM(this.node, this.dom);
	}

	update(node: PMNode): boolean {
		if (node.type !== this.node.type) return false;
		this.node = node;
		this.options.modifyDOM && this.options.modifyDOM(this.node, this.dom);
		return true;
	}
}
