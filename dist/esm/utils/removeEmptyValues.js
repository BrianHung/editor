export function removeEmptyValues(attrs) {
    return Object.fromEntries(Object.entries(attrs).filter(([key, val]) => val !== null && val !== undefined));
}
