export function tableNodes(options: any): {
    table: {
        content: string;
        tableRole: string;
        isolating: boolean;
        group: any;
        parseDOM: {
            tag: string;
        }[];
        toDOM(): (string | (string | number)[])[];
    };
    table_row: {
        content: string;
        tableRole: string;
        parseDOM: {
            tag: string;
        }[];
        toDOM(): (string | number)[];
    };
    table_cell: {
        content: any;
        attrs: {
            colspan: {
                default: number;
            };
            rowspan: {
                default: number;
            };
            colwidth: {
                default: any;
            };
        };
        tableRole: string;
        isolating: boolean;
        parseDOM: {
            tag: string;
            getAttrs: (dom: any) => {
                colspan: number;
                rowspan: number;
                colwidth: any;
            };
        }[];
        toDOM(node: any): (string | number | {
            colspan: any;
            rowspan: any;
            "data-colwidth": any;
        })[];
    };
    table_header: {
        content: any;
        attrs: {
            colspan: {
                default: number;
            };
            rowspan: {
                default: number;
            };
            colwidth: {
                default: any;
            };
        };
        tableRole: string;
        isolating: boolean;
        parseDOM: {
            tag: string;
            getAttrs: (dom: any) => {
                colspan: number;
                rowspan: number;
                colwidth: any;
            };
        }[];
        toDOM(node: any): (string | number | {
            colspan: any;
            rowspan: any;
            "data-colwidth": any;
        })[];
    };
};
export function tableNodeTypes(schema: any): any;
//# sourceMappingURL=schema.d.ts.map