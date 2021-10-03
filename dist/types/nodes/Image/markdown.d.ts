import { MarkdownSerializerState } from "prosemirror-markdown";
import type { Node as PMNode } from "prosemirror-model";
export declare const toMarkdown: (state: MarkdownSerializerState, node: PMNode) => void;
export declare const fromMarkdown: () => {
    node: string;
    getAttrs: (tok: any) => {
        src: any;
        title: any;
        alt: any;
    };
};
//# sourceMappingURL=markdown.d.ts.map