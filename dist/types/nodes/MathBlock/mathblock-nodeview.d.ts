import { NodeViewProps } from '../../Node.js';
import type { Node as PMNode } from 'prosemirror-model';
import type { NodeView } from 'prosemirror-view';
export declare class MathBlockNodeView implements NodeView {
    dom: HTMLDivElement;
    contentDOM: HTMLElement;
    node: PMNode;
    render: HTMLDivElement;
    katex: typeof import('./katex') | null;
    constructor(props: NodeViewProps);
    update: NodeView['update'];
    ignoreMutation: NodeView['ignoreMutation'];
    renderLaTeX(text: string): void;
}
//# sourceMappingURL=mathblock-nodeview.d.ts.map