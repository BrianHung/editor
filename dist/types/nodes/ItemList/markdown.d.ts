import { MarkdownSerializerState } from "prosemirror-markdown";
import type { Node as PMNode } from "prosemirror-model";
export declare const toMarkdown: (state: MarkdownSerializerState, node: PMNode) => void;
export declare const fromMarkdown: () => {
    block: string;
    getAttrs: (tok: any, tokens: any, i: any) => {
        tight: any;
    };
};
//# sourceMappingURL=markdown.d.ts.map