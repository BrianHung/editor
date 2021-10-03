import { Extension } from "../Extension.js";
import { FocusMode as FocusModePlugin, toggleFocusMode } from "../plugins/FocusMode.js";
export const FocusMode = (options) => Extension(Object.assign({ name: 'focusMode', plugins() {
        return [
            FocusModePlugin()
        ];
    },
    commands() {
        return {
            focusMode: focus => toggleFocusMode(focus)
        };
    },
    keymap() {
        return {
            "Shift-Ctrl-f": toggleFocusMode()
        };
    } }, options));
