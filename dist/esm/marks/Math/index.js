import Mark from '../Mark';
import InlineMathPlugin from "./inline-math-plugin";
export default class Math extends Mark {
    get name() {
        return 'math';
    }
    get schema() {
        return {
            inclusive: false,
            toDOM: () => ['math', { "spellCheck": "false" }, 0],
            parseDOM: [{ tag: 'math' }],
        };
    }
    get plugins() {
        return [InlineMathPlugin()];
    }
}
