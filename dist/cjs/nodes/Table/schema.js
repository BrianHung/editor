"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableNodeTypes = exports.tableNodes = void 0;
function getCellAttrs(dom, extraAttrs) {
    let widthAttr = dom.getAttribute("data-colwidth");
    let widths = widthAttr && /^\d+(,\d+)*$/.test(widthAttr) ? widthAttr.split(",").map(s => Number(s)) : null;
    let colspan = Number(dom.getAttribute("colspan") || 1);
    let result = {
        colspan,
        rowspan: Number(dom.getAttribute("rowspan") || 1),
        colwidth: widths && widths.length == colspan ? widths : null
    };
    for (let prop in extraAttrs) {
        let getter = extraAttrs[prop].getFromDOM;
        let value = getter && getter(dom);
        if (value != null)
            result[prop] = value;
    }
    return result;
}
function setCellAttrs(node, extraAttrs) {
    let attrs = {};
    if (node.attrs.colspan != 1)
        attrs.colspan = node.attrs.colspan;
    if (node.attrs.rowspan != 1)
        attrs.rowspan = node.attrs.rowspan;
    if (node.attrs.colwidth)
        attrs["data-colwidth"] = node.attrs.colwidth.join(",");
    for (let prop in extraAttrs) {
        let setter = extraAttrs[prop].setDOMAttr;
        if (setter)
            setter(node.attrs[prop], attrs);
    }
    return attrs;
}
function tableNodes(options) {
    let extraAttrs = options.cellAttributes || {};
    let cellAttrs = {
        colspan: { default: 1 },
        rowspan: { default: 1 },
        colwidth: { default: null }
    };
    for (let prop in extraAttrs)
        cellAttrs[prop] = { default: extraAttrs[prop].default };
    return {
        table: {
            content: "table_row+",
            tableRole: "table",
            isolating: true,
            group: options.tableGroup,
            parseDOM: [{ tag: "table" }],
            toDOM() { return ["table", ["tbody", 0]]; }
        },
        table_row: {
            content: "(table_cell | table_header)*",
            tableRole: "row",
            parseDOM: [{ tag: "tr" }],
            toDOM() { return ["tr", 0]; }
        },
        table_cell: {
            content: options.cellContent,
            attrs: cellAttrs,
            tableRole: "cell",
            isolating: true,
            parseDOM: [{ tag: "td", getAttrs: dom => getCellAttrs(dom, extraAttrs) }],
            toDOM(node) { return ["td", setCellAttrs(node, extraAttrs), 0]; }
        },
        table_header: {
            content: options.cellContent,
            attrs: cellAttrs,
            tableRole: "tableheader",
            isolating: true,
            parseDOM: [{ tag: "th", getAttrs: dom => getCellAttrs(dom, extraAttrs) }],
            toDOM(node) { return ["th", setCellAttrs(node, extraAttrs), 0]; }
        }
    };
}
exports.tableNodes = tableNodes;
function tableNodeTypes(schema) {
    let tableNodeTypes = schema.cached.tableNodeTypes;
    if (tableNodeTypes == null) {
        tableNodeTypes = schema.cached.tableNodeTypes = {};
        for (let name in schema.nodes) {
            let type = schema.nodes[name];
            if (type.spec.tableRole)
                result[name] = type;
        }
    }
    return result;
}
exports.tableNodeTypes = tableNodeTypes;
