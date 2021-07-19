import type { NodeView, EditorView } from "prosemirror-view";
import type { Node as PMNode } from "prosemirror-model";
import { CustomNodeViewProps } from "../Node";
export default class TodoItemView implements NodeView {
    dom: HTMLElement;
    contentDOM: HTMLElement;
    node: PMNode;
    view: EditorView;
    getPos: () => number;
    checkbox: HTMLInputElement;
    constructor(props: CustomNodeViewProps);
    update(node: PMNode): boolean;
}
//# sourceMappingURL=todoitem-nodeview.d.ts.map