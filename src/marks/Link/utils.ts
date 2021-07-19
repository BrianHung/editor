import type { EditorView } from "prosemirror-view";

// Restores browser default for click+modkeys on anchor links.
export function defaultOnClick(event: MouseEvent, view: EditorView) {

  // Defer to default browser behavior for links when contenteditable=false.
  if (view.editable == false) return; 

  // Left click requires modkeys; middle click does not.
  if ((event.button == 0 && (event.shiftKey || event.altKey || (/Mac/.test(navigator.platform) ? event.metaKey : event.ctrlKey))) || event.button == 1) {
    window.open((event.target as HTMLAnchorElement).href);
    return true;
  }

  return false;
}