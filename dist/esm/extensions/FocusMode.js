import Extension from "./Extension";
import { FocusMode as FocusModePlugin, toggleFocusMode } from "../plugins/FocusMode";
export default class FocusMode extends Extension {
    get name() {
        return 'FocusMode';
    }
    keys() {
        return {
            "Shift-Ctrl-f": toggleFocusMode
        };
    }
    commands() {
        return () => toggleFocusMode;
    }
    get plugins() {
        return [
            FocusModePlugin()
        ];
    }
}
