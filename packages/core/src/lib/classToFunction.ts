import { Node } from 'prosemirror-model';
import { Decoration, DecorationSource, EditorView, NodeView, NodeViewConstructor } from 'prosemirror-view';

export interface ClassNodeViewConstructor {
	new (
		node: Node,
		view: EditorView,
		getPos: () => number | undefined,
		decorations?: readonly Decoration[],
		innerDecorations?: DecorationSource
	): NodeView;
}

export const classToFunction =
	<T extends ClassNodeViewConstructor>(Class: T): NodeViewConstructor =>
	(node, view, getPos, decorations, innerDecorations) =>
		new Class(node, view, getPos, decorations, innerDecorations);
