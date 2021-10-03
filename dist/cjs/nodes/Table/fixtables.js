"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixTable = exports.fixTables = exports.FixTablesKey = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const tablemap_1 = require("./tablemap");
const util_1 = require("./util");
const schema_1 = require("./schema");
exports.FixTablesKey = new prosemirror_state_1.PluginKey("FixTables");
function changedDescendants(old, cur, offset, f) {
    let oldSize = old.childCount, curSize = cur.childCount;
    outer: for (let i = 0, j = 0; i < curSize; i++) {
        let child = cur.child(i);
        for (let scan = j, e = Math.min(oldSize, i + 3); scan < e; scan++) {
            if (old.child(scan) == child) {
                j = scan + 1;
                offset += child.nodeSize;
                continue outer;
            }
        }
        f(child, offset);
        if (j < oldSize && old.child(j).sameMarkup(child))
            changedDescendants(old.child(j), child, offset + 1, f);
        else
            child.nodesBetween(0, child.content.size, f, offset + 1);
        offset += child.nodeSize;
    }
}
function fixTables(state, oldState) {
    let tr, check = (node, pos) => {
        if (node.type.spec.tableRole == "table")
            tr = fixTable(state, node, pos, tr);
    };
    if (!oldState)
        state.doc.descendants(check);
    else if (oldState.doc != state.doc)
        changedDescendants(oldState.doc, state.doc, 0, check);
    return tr;
}
exports.fixTables = fixTables;
function fixTable(state, table, tablePos, tr) {
    let map = tablemap_1.TableMap.get(table);
    if (!map.problems)
        return tr;
    if (!tr)
        tr = state.tr;
    let mustAdd = [];
    for (let i = 0; i < map.height; i++)
        mustAdd.push(0);
    for (let i = 0; i < map.problems.length; i++) {
        let prob = map.problems[i];
        if (prob.type == "collision") {
            let cell = table.nodeAt(prob.pos);
            for (let j = 0; j < cell.attrs.rowspan; j++)
                mustAdd[prob.row + j] += prob.n;
            tr.setNodeMarkup(tr.mapping.map(tablePos + 1 + prob.pos), null, (0, util_1.removeColSpan)(cell.attrs, cell.attrs.colspan - prob.n, prob.n));
        }
        else if (prob.type == "missing") {
            mustAdd[prob.row] += prob.n;
        }
        else if (prob.type == "overlong_rowspan") {
            let cell = table.nodeAt(prob.pos);
            tr.setNodeMarkup(tr.mapping.map(tablePos + 1 + prob.pos), null, (0, util_1.setAttr)(cell.attrs, "rowspan", cell.attrs.rowspan - prob.n));
        }
        else if (prob.type == "colwidth mismatch") {
            let cell = table.nodeAt(prob.pos);
            tr.setNodeMarkup(tr.mapping.map(tablePos + 1 + prob.pos), null, (0, util_1.setAttr)(cell.attrs, "colwidth", prob.colwidth));
        }
    }
    let first, last;
    for (let i = 0; i < mustAdd.length; i++)
        if (mustAdd[i]) {
            if (first == null)
                first = i;
            last = i;
        }
    for (let i = 0, pos = tablePos + 1; i < map.height; i++) {
        let row = table.child(i);
        let end = pos + row.nodeSize;
        let add = mustAdd[i];
        if (add > 0) {
            let tableNodeType = 'cell';
            if (row.firstChild) {
                tableNodeType = row.firstChild.type.spec.tableRole;
            }
            let nodes = [];
            for (let j = 0; j < add; j++)
                nodes.push((0, schema_1.tableNodeTypes)(state.schema)[tableNodeType].createAndFill());
            let side = (i == 0 || first == i - 1) && last == i ? pos + 1 : end - 1;
            tr.insert(tr.mapping.map(side), nodes);
        }
        pos = end;
    }
    return tr.setMeta(exports.FixTablesKey, { fixTables: true });
}
exports.fixTable = fixTable;
