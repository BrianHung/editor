import { MarkdownSerializerState } from 'prosemirror-markdown';
import type { Node as PMNode } from "prosemirror-model";
import Token from "markdown-it/lib/token";
export declare const toMarkdown: (state: MarkdownSerializerState, node: PMNode) => void;
export declare const fromMarkdown: () => {
    block: string;
    getAttrs: (tok: Token) => {
        checked: boolean;
    };
};
//# sourceMappingURL=markdown.d.ts.map