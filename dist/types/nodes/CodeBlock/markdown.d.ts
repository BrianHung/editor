import { MarkdownSerializerState } from "prosemirror-markdown";
import type { Node as PMNode } from "prosemirror-model";
export declare const toMarkdown: (state: MarkdownSerializerState, node: PMNode) => void;
export declare const markdownToken: () => string;
export declare const fromMarkdown: () => {
    block: string;
    getAttrs: (tok: any) => {
        language: any;
    };
};
//# sourceMappingURL=markdown.d.ts.map