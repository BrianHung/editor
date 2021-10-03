export function defaultOnClick(event, view) {
    if (view.editable == false)
        return;
    if ((event.button == 0 && (event.shiftKey || event.altKey || (/Mac/.test(navigator.platform) ? event.metaKey : event.ctrlKey))) || event.button == 1) {
        window.open(event.target.href);
        return true;
    }
    return false;
}
