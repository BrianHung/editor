"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function nodeEqualsType({ types, node }) {
    return (Array.isArray(types) && types.includes(node.type)) || node.type === types;
}
exports.default = nodeEqualsType;
