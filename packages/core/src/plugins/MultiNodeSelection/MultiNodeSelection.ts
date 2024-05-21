/**
 * WIP
 */

// https://github.com/ProseMirror/prosemirror-tables/blob/master/src/MultiNodeSelection.js
// https://github.com/ProseMirror/prosemirror-gapcursor/blob/master/src/gapcursor.js
// https://github.com/ProseMirror/prosemirror-state/blob/master/src/selection.js
// https://discuss.prosemirror.net/t/help-marquee-selection-selecting-multiple-nodes-for-dragging/2569
// https://discuss.prosemirror.net/t/select-items-that-are-not-next-to-each-other/5163/8

import { Fragment, Node as PMNode, ResolvedPos, Slice } from 'prosemirror-model';
import { NodeSelection, Selection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

// ::- A multinode selection is a selection that points at multiple nodes.
// All nodes marked [selectable](#model.NodeSpec.selectable) can be
// the target of a multinode selection. In such a selection, ...

export class MultiNodeSelection extends Selection<any> {
	anchors: ResolvedPos[];
	nodes: PMNode[];

	constructor(anchors: ResolvedPos[]) {
		let lastNode = anchors[anchors.length - 1];
		let $start = anchors[0];
		let $end = lastNode.node(0).resolve(lastNode.pos + lastNode.nodeAfter.nodeSize);
		super($start, $end);
		this.anchors = anchors;
		this.nodes = anchors.map(pos => pos.nodeAfter);
	}

	// @ts-ignore
	map(doc, mapping) {
		const mappedAnchors = this.anchors
			.map(anchor => mapping.mapResult(anchor.pos))
			.filter(({ deleted }) => deleted)
			.map(({ pos }) => doc.resolve(pos));

		return new MultiNodeSelection(mappedAnchors);

		let { deleted, pos } = mapping.mapResult(this.anchor);
		let $pos = doc.resolve(pos);
		if (deleted) return Selection.near($pos);
		return new NodeSelection($pos);
	}

	content() {
		return new Slice(Fragment.from(this.nodes), 0, 0);
	}

	replace(tr, content = Slice.empty) {}

	replaceWith(tr, node) {
		this.replace(tr, new Slice(Fragment.from(node), 0, 0));
	}

	forEachNode(f) {}

	// @ts-ignore
	eq(other: MultiNodeSelection) {
		return (
			other instanceof MultiNodeSelection &&
			other.anchors.length === this.anchors.length &&
			other.anchors.every((anchor, i) => anchor.pos == this.anchors[i].pos)
		);
	}

	toJSON() {
		return { type: 'multinode', anchors: this.anchors };
	}

	static fromJSON(doc, json) {
		return new MultiNodeSelection(json.anchors);
	}

	// :: (Node, number, ?number) → MultiNodeSelection
	static create(doc, anchors) {
		return new MultiNodeSelection(anchors);
	}

	// @ts-ignore
	getBookmark() {
		// @ts-ignore
		return new MultiNodeBookmark(this.$anchorCell.pos, this.$headCell.pos);
	}
}

// :: bool
// Controls whether, when a selection of this type is active in the
// browser, the selected range should be visible to the user.
// Set to `false` to hide browser cursor.
MultiNodeSelection.prototype.visible = false;

// @ts-ignore
Selection.jsonID('multinode', MultiNodeSelection);

class MultiNodeBookmark {
	anchors: Number[];

	constructor(anchors) {
		this.anchors = anchors;
	}

	map(mapping) {
		return new MultiNodeBookmark(this.anchors.map(anchor => mapping.map(anchor)));
	}

	resolve(doc) {}
}

export function drawMultiNodeSelection(state) {
	if (!(state.selection instanceof MultiNodeSelection)) {
		return null;
	}
	const decorations = [];
	state.selection.forEachNode((node, pos) =>
		decorations.push(
			Decoration.node(pos, pos + node.nodeSize, {
				class: 'ProseMirror-selectnode',
			})
		)
	);
	return DecorationSet.create(state.doc, decorations);
}
