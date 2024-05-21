import type { Node as PMNode } from 'prosemirror-model';
import { EditorState, Plugin, TextSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export default function Placeholder({
	emptyEditorClass = 'ProseMirror-emptydoc',
	emptyNodeClass = 'ProseMirror-emptynode',
	placeholder,
}: {
	emptyEditorClass?: string;
	emptyNodeClass?: string;
	placeholder?: string | (({ state, node, pos }: { state: EditorState; node: PMNode; pos: number }) => string);
} = {}): Plugin {
	let emptyTopNode: PMNode;

	return new Plugin({
		props: {
			decorations: (state): DecorationSet => {
				const { doc, selection } = state;
				const decorations: Decoration[] = [];

				// Source: https://github.com/PierBover/prosemirror-cookbook#decorations

				if (selection instanceof TextSelection && selection.$cursor) {
					let pos = doc.resolve(selection.$cursor.pos); // `before` and `after` results in error when cursor is at depth=0
					pos.depth &&
						decorations.push(
							Decoration.node(pos.before(), pos.after(), {
								class: 'ProseMirror-cursornode',
							})
						);
				}

				doc.nodesBetween(selection.from, selection.to, (node, pos) => {
					if (node.isTextblock || (node.isAtom && !node.isText)) {
						decorations.push(
							Decoration.node(pos, pos + node.nodeSize, {
								class: 'ProseMirror-activenode',
							})
						);
					}
					return node.isBlock;
				});

				doc.descendants((node: PMNode, pos: number) => {
					// Apply only if directly has text, or is atom and not a text node.
					if (node.isTextblock || (node.isAtom && !node.isText)) {
						const isEmpty = node.isTextblock && node.content.size === 0;
						isEmpty &&
							decorations.push(
								Decoration.node(pos, pos + node.nodeSize, {
									class: emptyNodeClass,
									'data-placeholder':
										typeof placeholder === 'string'
											? placeholder
											: placeholder({
													state,
													node,
													pos,
												}),
								})
							);
					}
					return node.isBlock;
				});

				return DecorationSet.create(doc, decorations);
			},

			/**
			 * ProseMirror does not allow for node decorations on topNode
			 * (position 0 results in error).
			 */
			attributes(state) {
				const { doc } = state;
				emptyTopNode = emptyTopNode || doc.type.createAndFill();
				let isEditorEmpty = emptyTopNode.sameMarkup(doc) && emptyTopNode.content.findDiffStart(doc.content) === null;
				if (isEditorEmpty) {
					return {
						class: emptyEditorClass,
						'data-placeholder':
							typeof placeholder === 'string'
								? placeholder
								: placeholder({
										state,
										node: doc,
										pos: 0,
									}),
					};
				}
			},
		},
	});
}

export { Placeholder };
