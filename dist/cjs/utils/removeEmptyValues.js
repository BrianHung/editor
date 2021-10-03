"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEmptyValues = void 0;
function removeEmptyValues(attrs) {
    return Object.fromEntries(Object.entries(attrs).filter(([key, val]) => val !== null && val !== undefined));
}
exports.removeEmptyValues = removeEmptyValues;
