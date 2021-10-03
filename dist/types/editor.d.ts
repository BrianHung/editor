import { EditorState, Plugin, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, Node as PMNode, NodeSpec, MarkSpec } from 'prosemirror-model';
import type { Command } from 'prosemirror-commands';
import { InputRule } from 'prosemirror-inputrules';
import type { Extension } from "./Extension.js";
import type { CustomNodeView, Node } from "./Node.js";
import type { CustomMarkView, Mark } from "./Mark.js";
declare type DOMNode = globalThis.Node;
declare type Extensions = (Extension | Mark | Node | Plugin)[];
export declare class Editor {
    view: EditorView;
    state: EditorState;
    schema: Schema;
    plugins: Plugin[];
    keymaps: Plugin[];
    inputRules: InputRule[];
    nodes: Record<string, NodeSpec>;
    marks: Record<string, MarkSpec>;
    commands: Record<string, Command>;
    options: {
        place?: DOMNode | ((p: DOMNode) => void) | {
            mount: DOMNode;
        };
        editorProps?: Record<string, any>;
        editable?: boolean | Function;
        extensions: Extensions;
        content?: {
            type: string;
            content: any;
        };
        selection?: JSON | Selection;
        topNode?: string;
        nodes?: Record<string, NodeSpec> | null;
        marks?: Record<string, MarkSpec> | null;
        schema?: Schema | null;
        parseOptions?: Record<string, any>;
        onChange?: Function;
        handleDOMEvents?: Record<string, (view: EditorView<any>, event: Event) => boolean>;
        viewAttributes?: Record<string, string>;
    };
    constructor(options?: {});
    static Nodes(nodes: Extensions): Record<string, NodeSpec>;
    static Marks(marks: Extensions): Record<string, MarkSpec>;
    static Schema({ topNode, nodes, marks }: {
        topNode: any;
        nodes: any;
        marks: any;
    }): Schema;
    static Plugins(extensions: Extensions, schema: Schema): Plugin[];
    static Keymaps(extensions: Extensions, schema: Schema): Plugin[];
    static InputRules(extensions: Extensions, schema: Schema): InputRule[];
    static Commands(extensions: Extensions, schema: Schema, view: EditorView): {
        [key: string]: Command;
    };
    static EditorView({ place, state, nodeViews, editable, viewAttributes, handleDOMEvents, editor }: {
        place: any;
        state: any;
        nodeViews: any;
        editable: any;
        viewAttributes: any;
        handleDOMEvents: any;
        editor: any;
    }): EditorView<any>;
    static EditorState({ schema, doc, selection, storedMarks, plugins }: {
        schema: any;
        doc: any;
        selection: any;
        storedMarks: any;
        plugins: any;
    }): EditorState<any>;
    defaultPlugins(): any[];
    createSelection(doc: PMNode, selection: undefined | JSON | Selection): Selection;
    static NodeViews(extensions: Extensions): Record<string, CustomNodeView | CustomMarkView>;
    destroy(): void;
    setContentAndSelection(content?: {
        type: string;
        content: any;
    } | null, selection?: Selection | JSON | null): void;
    static Text(state: EditorState): string;
    static HTML(state: EditorState): string;
    static fromHTML(html: string, schema: Schema, parseOptions: any): PMNode<Schema<any, any>>;
    static JSON(state: EditorState): {
        [key: string]: any;
    };
    get Text(): string;
    get HTML(): string;
    get JSON(): {
        [key: string]: any;
    };
}
export {};
//# sourceMappingURL=editor.d.ts.map