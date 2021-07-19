"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function removeEmptyAttrs(attrs) {
    return Object.fromEntries(Object.entries(attrs).filter(([key, val]) => !!val));
}
exports.default = removeEmptyAttrs;
