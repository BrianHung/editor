import { NodeViewProps } from '../../Node.js';
import type { Node as PMNode } from "prosemirror-model";
import type { NodeView } from 'prosemirror-view';
export declare class ImageNodeView implements NodeView {
    dom: HTMLDivElement;
    contentDOM: HTMLElement;
    node: NodeViewProps['node'];
    view: NodeViewProps['view'];
    getPos: NodeViewProps['getPos'];
    image: HTMLImageElement;
    toolbar: HTMLDivElement;
    constructor(props: NodeViewProps);
    update(node: PMNode): boolean;
}
//# sourceMappingURL=image-nodeview.d.ts.map