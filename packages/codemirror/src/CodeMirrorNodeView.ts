import { EditorView as CodeMirror } from '@codemirror/view';
import { Node } from 'prosemirror-model';
import { Decoration, DecorationSource, EditorView, NodeView } from 'prosemirror-view';
import {
	editable,
	language,
	lineNumber,
	lineWrapping,
	setLanguage,
	setLineNumbers,
	setLineWrapping,
	viewExtensions,
} from './CodeMirror';
import { CodeMirrorView } from './CodeMirrorView';

export class CodeMirrorNodeView extends CodeMirrorView implements NodeView {
	public dom: HTMLElement;

	constructor(
		node: Node,
		view: EditorView,
		getPos: () => number | undefined,
		decorations?: readonly Decoration[],
		innerDecorations?: DecorationSource
	) {
		super(node, view, getPos, decorations, innerDecorations);

		// The editor's outer node is our DOM representation
		this.dom = document.createElement('pre');
		this.dom.className = 'CodeMirror';
		this.dom.appendChild(this.cmView.dom);

		this.dom.dataset.language = this.node.attrs.language || '';
		this.dom.dataset.lineNumbers = this.node.attrs.lineNumbers.toString();

		// Optional extensions
		setLanguage(this.cmView, this.node.attrs.language || '');
		setLineNumbers(this.cmView, this.node.attrs.lineNumbers || false);
		setLineWrapping(this.cmView, this.node.attrs.lineWrapping || false);
	}

	get cmExtensions() {
		return [
			super.cmExtensions,
			viewExtensions,
			editable.of(CodeMirror.editable.of(this.view.editable || true)),
			language.of([]),
			lineNumber.of([]),
			lineWrapping.of([]),
		];
	}
}
