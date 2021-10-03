"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTextChanged = exports.hasDocChanged = void 0;
const prosemirror_transform_1 = require("prosemirror-transform");
function hasDocChanged(transactions) {
    return transactions.reduce((docChanged, tr) => docChanged || tr.docChanged, false);
}
exports.hasDocChanged = hasDocChanged;
function hasTextChanged(transactions) {
    return transactions.some(({ steps }) => steps.some((step) => step instanceof prosemirror_transform_1.ReplaceStep || step instanceof prosemirror_transform_1.ReplaceAroundStep));
}
exports.hasTextChanged = hasTextChanged;
