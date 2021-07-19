import { Plugin, PluginKey } from "prosemirror-state";
import type { Transaction } from "prosemirror-state";
import type { Node as PMNode } from "prosemirror-model";
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import type { LanguageDescription } from "@codemirror/language";
export declare const SyntaxHighlightKey: PluginKey<any, any>;
export declare function SyntaxHighlightPlugin(options?: any): Plugin<any, any>;
export default SyntaxHighlightPlugin;
export declare var syntaxHighlight: typeof import("./syntaxHighlight").syntaxHighlight | null;
export declare class SyntaxHighlightView {
    view: EditorView;
    constructor(view: EditorView);
    update(view: EditorView): void;
    importLanguages(langs: LanguageDescription[]): Promise<void>;
}
export declare class CodeBlockState {
    node: PMNode;
    pos: number;
}
export declare class SyntaxHighlightState {
    languagesToImport: Set<LanguageDescription>;
    languages: Set<LanguageDescription>;
    codeblocks: Array<number>;
    decorations: DecorationSet;
    constructor(config: any, state: any);
    applyTransaction(tr: Transaction): this;
    getDecorations(nodePos: {
        node: PMNode;
        pos: number;
    }[]): Decoration[];
}
//# sourceMappingURL=SyntaxHighlightPlugin.d.ts.map