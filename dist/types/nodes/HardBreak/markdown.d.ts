import { MarkdownSerializerState } from "prosemirror-markdown";
import type { Node as PMNode } from "prosemirror-model";
export declare const toMarkdown: (state: MarkdownSerializerState, node: PMNode, parent: any, index: any) => void;
export declare const fromMarkdown: () => {
    hardbreak: {
        node: string;
    };
};
//# sourceMappingURL=markdown.d.ts.map