import type { NodeViewProps } from '../../Node.js';
import type { Node as PMNode } from "prosemirror-model";
import type { NodeView } from 'prosemirror-view';
export default class CodeBlockNodeView implements NodeView {
    dom: HTMLElement;
    contentDOM: HTMLElement;
    node: PMNode;
    lineNumbers: HTMLElement;
    constructor(props: NodeViewProps);
    update(node: PMNode): boolean;
}
//# sourceMappingURL=codeblock-nodeview.d.ts.map