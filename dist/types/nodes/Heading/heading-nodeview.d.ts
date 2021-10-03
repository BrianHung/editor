import type { NodeView } from "prosemirror-view";
import type { Node as PMNode } from "prosemirror-model";
import type { NodeViewProps } from '../../Node.js';
export default class HeadingView implements NodeView {
    dom: HTMLElement;
    contentDOM: HTMLElement;
    node: PMNode;
    options: any;
    constructor(props: NodeViewProps, options: any);
    update(node: PMNode): boolean;
}
//# sourceMappingURL=heading-nodeview.d.ts.map