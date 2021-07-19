import type { NodeView } from "prosemirror-view";
import type { Node as PMNode } from "prosemirror-model";
import Node, { CustomNodeViewProps } from "../Node";
export default class TitleView implements NodeView {
    dom: HTMLElement;
    contentDOM: HTMLElement;
    extension: Node;
    node: PMNode;
    constructor(props: CustomNodeViewProps);
    update(node: PMNode): boolean;
}
//# sourceMappingURL=title-nodeview.d.ts.map