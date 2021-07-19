import Node, { CustomNodeViewProps } from '../Node';
import type { Node as PMNode } from "prosemirror-model";
import type { NodeView } from 'prosemirror-view';
export default class CodeBlockNodeView implements NodeView {
    dom: HTMLElement;
    contentDOM: HTMLElement;
    extension: Node;
    node: PMNode;
    lineNumbers: HTMLElement;
    constructor(props: CustomNodeViewProps);
    update(node: PMNode): boolean;
}
//# sourceMappingURL=codeblock-nodeview.d.ts.map