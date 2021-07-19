import { CustomNodeViewProps } from '../Node';
import type { Node as PMNode } from "prosemirror-model";
import type { NodeView } from 'prosemirror-view';
export default class MathBlockNodeView implements NodeView {
    dom: HTMLDivElement;
    contentDOM: HTMLElement;
    node: PMNode;
    render: HTMLDivElement;
    katex: typeof import('./katex') | null;
    constructor(props: CustomNodeViewProps);
    update(node: PMNode): boolean;
    ignoreMutation(mutation: MutationRecord): boolean;
    renderLaTeX(text: string): void;
}
//# sourceMappingURL=mathblock-nodeview.d.ts.map