import { Mark } from '../../Mark.js';
import InlineMathPlugin from "./inline-math-plugin.js";
export const Math = (options) => Mark(Object.assign({ name: 'math', inclusive: false, toDOM: () => ['math', { "spellCheck": "false" }, 0], parseDOM: [{ tag: 'math' }], plugins() {
        return [InlineMathPlugin()];
    } }, options));
