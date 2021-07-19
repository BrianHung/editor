import Node, { CustomNodeViewProps } from "../Node";
import type { NodeSpec } from "prosemirror-model";
import TitleNodeView from "./title-nodeview";
export default class Title extends Node {
    get name(): string;
    get schema(): NodeSpec;
    get defaultOptions(): {
        handleTitleChange: (title: string) => string;
    };
    customNodeView(props: CustomNodeViewProps): TitleNodeView;
}
//# sourceMappingURL=index.d.ts.map