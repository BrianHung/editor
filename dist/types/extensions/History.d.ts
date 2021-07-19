import Extension from "./Extension";
import { undo, redo } from "prosemirror-history";
export default class History extends Extension {
    get name(): string;
    keys(): {
        "Mod-z": typeof undo;
        "Shift-Mod-z": typeof redo;
    };
    get plugins(): import("prosemirror-state").Plugin<any, any>[];
}
//# sourceMappingURL=History.d.ts.map