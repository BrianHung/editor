export function removeEmptyValues(attrs: Record<string, any>) {
  return Object.fromEntries(Object.entries(attrs).filter(([key, val]) => val !== null && val !== undefined))
}