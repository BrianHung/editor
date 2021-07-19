import Node from '../Node';
import type { NodeSpec } from "prosemirror-model";
import TodoItemNodeView from "./todoitem-nodeview";
import { InputRule } from 'prosemirror-inputrules';
import { toggleChecked } from './keymaps';
export default class TodoItem extends Node {
    get name(): string;
    get schema(): NodeSpec;
    inputRules({ nodeType }: {
        nodeType: any;
    }): InputRule<any>[];
    keys({ nodeType }: {
        nodeType: any;
    }): {
        'Ctrl-d': typeof toggleChecked;
        Enter: (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        Tab: (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        'Shift-Tab': (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        "Mod-[": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        "Mod-]": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    };
    customNodeView(props: any): TodoItemNodeView;
}
//# sourceMappingURL=index.d.ts.map