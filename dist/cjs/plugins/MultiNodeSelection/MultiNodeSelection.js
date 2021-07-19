"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawMultiNodeSelection = exports.MultiNodeSelection = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
const prosemirror_model_1 = require("prosemirror-model");
class MultiNodeSelection extends prosemirror_state_1.Selection {
    constructor(anchors) {
        let lastNode = anchors[anchors.length - 1];
        let $start = anchors[0];
        let $end = lastNode.node(0).resolve(lastNode.pos + lastNode.nodeAfter.nodeSize);
        super($start, $end);
        this.anchors = anchors;
        this.nodes = anchors.map(pos => pos.nodeAfter);
    }
    map(doc, mapping) {
        const mappedAnchors = this.anchors
            .map(anchor => mapping.mapResult(anchor.pos))
            .filter(({ deleted }) => deleted)
            .map(({ pos }) => doc.resolve(pos));
        return new MultiNodeSelection(mappedAnchors);
        let { deleted, pos } = mapping.mapResult(this.anchor);
        let $pos = doc.resolve(pos);
        if (deleted)
            return prosemirror_state_1.Selection.near($pos);
        return new prosemirror_state_1.NodeSelection($pos);
    }
    content() {
        return new prosemirror_model_1.Slice(prosemirror_model_1.Fragment.from(this.nodes), 0, 0);
    }
    replace(tr, content = prosemirror_model_1.Slice.empty) {
    }
    replaceWith(tr, node) {
        this.replace(tr, new prosemirror_model_1.Slice(prosemirror_model_1.Fragment.from(node), 0, 0));
    }
    forEachNode(f) {
    }
    eq(other) {
        return other instanceof MultiNodeSelection && other.anchors.length === this.anchors.length
            && other.anchors.every((anchor, i) => anchor.pos == this.anchors[i].pos);
    }
    toJSON() {
        return { type: "multinode", anchors: this.anchors };
    }
    static fromJSON(doc, json) {
        return new MultiNodeSelection(json.anchors);
    }
    static create(doc, anchors) {
        return new MultiNodeSelection(anchors);
    }
    getBookmark() {
        return new MultiNodeBookmark(this.$anchorCell.pos, this.$headCell.pos);
    }
}
exports.MultiNodeSelection = MultiNodeSelection;
MultiNodeSelection.prototype.visible = false;
prosemirror_state_1.Selection.jsonID("multinode", MultiNodeSelection);
class MultiNodeBookmark {
    constructor(anchors) {
        this.anchors = anchors;
    }
    map(mapping) {
        return new MultiNodeBookmark(this.anchors.map(anchor => mapping.map(anchor)));
    }
    resolve(doc) {
    }
}
function drawMultiNodeSelection(state) {
    if (!(state.selection instanceof MultiNodeSelection)) {
        return null;
    }
    const decorations = [];
    state.selection.forEachNode((node, pos) => decorations.push(prosemirror_view_1.Decoration.node(pos, pos + node.nodeSize, { class: "ProseMirror-selectnode" })));
    return prosemirror_view_1.DecorationSet.create(state.doc, decorations);
}
exports.drawMultiNodeSelection = drawMultiNodeSelection;
