"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultBlockAt = void 0;
function defaultBlockAt(match) {
    for (let i = 0; i < match.edgeCount; i++) {
        let { type } = match.edge(i);
        if (type.isTextblock && !type.hasRequiredAttrs())
            return type;
    }
    return null;
}
exports.defaultBlockAt = defaultBlockAt;
