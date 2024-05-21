import { Node } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';

// Expose plugin key to allow external commands.
export const CollapsibleHeadingsKey = new PluginKey('CollapsibleHeadings');

export default function CollapsibleHeadings() {
	return new Plugin({
		state: {
			init(config, state) {
				return new CollapsibleHeadingsState(state);
			},
			apply(tr, pluginState, prevState, nextState) {
				return pluginState.applyTransaction(tr);
			},
		},
		props: {
			decorations(state) {
				return this.getState(state).decorations;
			},
		},
		key: CollapsibleHeadingsKey,
	});
}

/**
 * Use plugin state to remember which heading nodes have collapsed.
 */
class CollapsibleHeadingsState {
	headings: { node: Node; pos: number }[];
	collapsedHeadings: Set<any>;
	decorations: DecorationSet;

	constructor(state: EditorState) {
		this.headings = [];
		state.doc.descendants((node, pos) => this.headings.push({ node, pos }) && node.isBlock);

		this.collapsedHeadings = new Set();

		this.decorations = this.headings.length
			? DecorationSet.create(state.doc, this.buildDecorations(this.headings))
			: DecorationSet.empty;
	}

	applyTransaction(tr: Transaction) {
		// Map array of headings through this transaction.
		this.headings = this.headings.reduce((headings, { node, pos }) => {
			const { deleted, pos: nextPos } = tr.mapping.mapResult(pos);
			return deleted ? headings : headings.concat({ node, pos: nextPos });
		}, []);

		let meta = tr.getMeta(CollapsibleHeadingsKey);

		// Keep old decorations if no change in document.
		if (meta === undefined && tr.docChanged === false) return this;

		// Map previous decorations through transactions.
		this.decorations = this.decorations.map(tr.mapping, tr.doc);

		// Push codeblocks which have been modified or whose language has been imported on this transaction.
		let modified = [];
		if (modified.length === 0) return this;

		// Reuse decorations in unmodified nodes and update decorations in modified nodes.
		const decorationOld = modified.map(({ node, pos }) => this.decorations.find(pos, pos + node.nodeSize)).flat();
		this.decorations = this.decorations.remove(decorationOld);
		this.decorations = this.decorations.add(tr.doc, this.buildDecorations(modified));
		return this;
	}

	// Render both a widget and a node decoration for each heading.
	buildDecorations(nodes: { node: Node; pos: number }[]) {
		return nodes
			.map(({ node, pos }) =>
				Decoration.widget(
					// Render widget decoration inside of the heading.
					pos + 1,
					buildHeadingWidget(node),
					// Render widget decoration before any of the heading content.
					{ side: -1 }
				)
			)
			.concat(
				nodes.map(({ node, pos }) =>
					Decoration.node(pos, pos + node.nodeSize, {
						'data-collapsed': this.collapsedHeadings.has(pos) ? 'true' : 'false',
					})
				)
			);
	}
}

function buildHeadingWidget(node: Node) {
	return function (view: EditorView, getPos: Function) {
		const widget = document.createElement('span');
		widget.style.userSelect = 'none';
		widget.style.cursor = 'pointer';
		widget.innerText = node ? 'e9b2' : 'e9ac';

		widget.onmousedown = event => event.preventDefault();
		widget.onclick = event => {
			const tr = view.state.tr;
		};

		return widget;
	};
}
