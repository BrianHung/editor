export declare const toMarkdown: {
    open(_state: any, mark: any, parent: any, index: any): "<" | "[";
    close(state: any, mark: any, parent: any, index: any): string;
};
export declare const fromMarkdown: {
    mark: string;
    getAttrs: (tok: any) => {
        href: any;
        title: any;
    };
};
//# sourceMappingURL=markdown.d.ts.map