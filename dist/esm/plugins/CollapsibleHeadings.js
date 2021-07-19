import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from "prosemirror-view";
export const CollapsibleHeadingsKey = new PluginKey("CollapsibleHeadings");
export default function CollapsibleHeadings() {
    return new Plugin({
        state: {
            init(configs, state) {
                return new CollapsibleHeadingsState(state);
            },
            apply(tr, pluginState, prevState, nextState) {
                return pluginState.applyTransaction(tr);
            }
        },
        props: {
            decorations(state) {
                return this.getState(state).decorations;
            },
        },
        key: CollapsibleHeadingsKey,
    });
}
class CollapsibleHeadingsState {
    constructor(state) {
        this.headings = [];
        state.doc.descendants((node, pos) => this.headings.push({ node, pos }) && node.isBlock);
        this.collapsedHeadings = new Set();
        this.decorations = this.headings.length ? DecorationSet.create(state.doc, this.buildDecorations(this.headings)) : DecorationSet.empty;
    }
    applyTransaction(tr) {
        this.headings = this.headings.reduce((headings, { node, pos }) => {
            const { deleted, pos: nextPos } = tr.mapping.mapResult(pos);
            return deleted ? headings : headings.concat({ node, pos: nextPos });
        }, []);
        let meta = tr.getMeta(CollapsibleHeadingsKey);
        if (meta === undefined && tr.docChanged === false)
            return this;
        this.decorations = this.decorations.map(tr.mapping, tr.doc);
        let modified = [];
        if (modified.length === 0)
            return this;
        const decorationOld = modified.map(({ node, pos }) => this.decorations.find(pos, pos + node.nodeSize)).flat();
        this.decorations = this.decorations.remove(decorationOld);
        this.decorations = this.decorations.add(tr.doc, this.buildDecorations(modified));
        return this;
    }
    buildDecorations(nodes) {
        return nodes.map(({ node, pos }) => Decoration.widget(pos + 1, buildHeadingWidget(node), { side: -1 })).concat(nodes.map(({ node, pos }) => Decoration.node(pos, pos + node.nodeSize, { 'data-collapsed': this.collapsedHeadings.has(pos) ? 'true' : 'false' })));
    }
}
function buildHeadingWidget(node) {
    return function (view, getPos) {
        const widget = document.createElement('span');
        widget.style.userSelect = 'none';
        widget.style.cursor = 'pointer';
        widget.innerText = node ? "\e9b2" : "\e9ac";
        widget.onmousedown = event => event.preventDefault();
        widget.onclick = event => {
            const tr = view.state.tr;
        };
        return widget;
    };
}
