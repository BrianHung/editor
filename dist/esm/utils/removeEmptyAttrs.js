export default function removeEmptyAttrs(attrs) {
    return Object.fromEntries(Object.entries(attrs).filter(([key, val]) => !!val));
}
