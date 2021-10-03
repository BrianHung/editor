import type { NodeView, EditorView } from "prosemirror-view";
import type { Node as PMNode } from "prosemirror-model";
import type { NodeViewProps } from '../../Node.js';
export default class ToggleItemView implements NodeView {
    dom: HTMLElement;
    contentDOM: HTMLElement;
    node: PMNode;
    view: EditorView;
    getPos: () => number;
    checkbox: HTMLInputElement;
    constructor(props: NodeViewProps);
    update(node: PMNode): boolean;
}
//# sourceMappingURL=toggle-nodeview.d.ts.map