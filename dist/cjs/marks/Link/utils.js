"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOnClick = void 0;
function defaultOnClick(event, view) {
    if (view.editable == false)
        return;
    if ((event.button == 0 && (event.shiftKey || event.altKey || (/Mac/.test(navigator.platform) ? event.metaKey : event.ctrlKey))) || event.button == 1) {
        window.open(event.target.href);
        return true;
    }
    return false;
}
exports.defaultOnClick = defaultOnClick;
