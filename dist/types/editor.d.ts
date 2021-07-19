import { EditorState, Plugin, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import type { NodeView } from 'prosemirror-view';
import { Schema, Node as PMNode, NodeSpec, MarkSpec } from 'prosemirror-model';
import { InputRule } from 'prosemirror-inputrules';
import Extension from "./extensions/Extension";
export declare class Editor {
    view: EditorView;
    state: EditorState;
    schema: Schema;
    plugins: Plugin[];
    keymaps: Plugin[];
    inputRules: InputRule[];
    nodes: {
        [name: string]: NodeSpec;
    };
    marks: {
        [name: string]: MarkSpec;
    };
    commands: Record<string, any>;
    options: {
        place?: Node | ((p: Node) => void) | {
            mount: Node;
        };
        editorProps?: Record<string, any>;
        editable?: boolean | Function;
        extensions: (Extension | Plugin)[];
        content?: {
            type: string;
            content: any;
        };
        selection?: JSON | Selection;
        topNode?: string;
        nodes?: {
            [name: string]: NodeSpec;
        } | null;
        marks?: {
            [name: string]: MarkSpec;
        } | null;
        schema?: Schema | null;
        parseOptions?: Record<string, any>;
        onChange?: Function;
        handleDOMEvents?: {
            [name: string]: (view: EditorView<any>, event: Event) => boolean;
        };
        viewAttributes?: Record<string, string>;
    };
    constructor(options?: {});
    static createNodes(nodes: (Extension | Plugin)[]): {
        [name: string]: NodeSpec;
    };
    static createMarks(marks: (Extension | Plugin)[]): {
        [name: string]: MarkSpec;
    };
    static createSchema({ topNode, nodes, marks }: {
        topNode: any;
        nodes: any;
        marks: any;
    }): Schema;
    static createPlugins(extensions: (Extension | Plugin)[]): Plugin[];
    static createKeymaps(extensions: (Extension | Plugin)[], schema: Schema): Plugin[];
    static createInputRules(extensions: (Extension | Plugin)[], schema: Schema): InputRule[];
    createCommands(): {};
    createEditorView(): EditorView<any>;
    static createEditorState({ schema, doc, selection, storedMarks, plugins }: {
        schema: any;
        doc: any;
        selection: any;
        storedMarks: any;
        plugins: any;
    }): EditorState<any>;
    defaultPlugins(): any[];
    createSelection(doc: PMNode, selection: undefined | JSON | Selection): Selection;
    static createNodeViews(extensions: (Extension | Plugin)[]): {
        [name: string]: () => NodeView;
    };
    destroy(): void;
    setContentAndSelection(content: {
        type: string;
        content: any;
    } | null, selection: Selection | null): void;
    get Text(): string;
    static HTML(state: EditorState): string;
    static fromHTML(html: string, schema: Schema, parseOptions: any): PMNode<Schema<any, any>>;
    static JSON(state: EditorState): {
        [key: string]: any;
    };
    get HTML(): string;
    get JSON(): {
        [key: string]: any;
    };
}
//# sourceMappingURL=editor.d.ts.map