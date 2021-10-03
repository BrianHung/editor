export function defaultBlockAt(match) {
    for (let i = 0; i < match.edgeCount; i++) {
        let { type } = match.edge(i);
        if (type.isTextblock && !type.hasRequiredAttrs())
            return type;
    }
    return null;
}
