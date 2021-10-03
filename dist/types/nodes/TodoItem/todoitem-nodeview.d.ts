import type { NodeView } from 'prosemirror-view';
import type { Node as PMNode } from 'prosemirror-model';
import { NodeViewProps } from '../../Node.js';
export declare class TodoItemNodeView implements NodeView {
    dom: HTMLElement;
    contentDOM: HTMLElement;
    node: NodeViewProps['node'];
    view: NodeViewProps['view'];
    getPos: NodeViewProps['getPos'];
    checkbox: HTMLInputElement;
    constructor(props: NodeViewProps);
    update(node: PMNode): boolean;
}
//# sourceMappingURL=todoitem-nodeview.d.ts.map