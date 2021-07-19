import Node from '../Node';
import type { NodeSpec } from "prosemirror-model";
import CustomNodeView from "./toggle-nodeview";
import { toggleToggled } from './keymaps';
export default class ToggleItem extends Node {
    get name(): string;
    get schema(): NodeSpec;
    keys({ nodeType }: {
        nodeType: any;
    }): {
        'Ctrl-l': typeof toggleToggled;
        Enter: (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        Tab: (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        'Shift-Tab': (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    };
    customNodeView(props: any): CustomNodeView;
}
//# sourceMappingURL=index.d.ts.map