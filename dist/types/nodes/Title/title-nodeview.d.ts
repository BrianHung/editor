import type { NodeView } from "prosemirror-view";
import type { Node as PMNode } from "prosemirror-model";
import { NodeViewProps } from "../../Node.js";
export default class TitleView implements NodeView {
    dom: HTMLElement;
    contentDOM: HTMLElement;
    node: PMNode;
    options: any;
    constructor(props: NodeViewProps, options: any);
    update(node: PMNode): boolean;
}
//# sourceMappingURL=title-nodeview.d.ts.map