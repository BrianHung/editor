import type { LanguageSupport } from "@codemirror/language";
export declare function syntaxHighlight(text: string, support: LanguageSupport, callback: (token: {
    text: string;
    style: string;
    from: number;
    to: number;
}) => void, options?: {
    match: (tag: import("@codemirror/highlight").Tag, scope: import("@lezer/common").NodeType) => string;
}): void;
//# sourceMappingURL=syntaxHighlight.d.ts.map