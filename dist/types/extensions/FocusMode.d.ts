import Extension from "./Extension";
import { toggleFocusMode } from "../plugins/FocusMode";
export default class FocusMode extends Extension {
    get name(): string;
    keys(): {
        "Shift-Ctrl-f": typeof toggleFocusMode;
    };
    commands(): () => typeof toggleFocusMode;
    get plugins(): import("prosemirror-state").Plugin<any, any>[];
}
//# sourceMappingURL=FocusMode.d.ts.map