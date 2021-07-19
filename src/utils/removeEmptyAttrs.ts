export default function removeEmptyAttrs(attrs: Record<string, any>) {
  return Object.fromEntries(Object.entries(attrs).filter(([key, val]) => !!val))
}