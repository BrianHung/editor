import Mark from '../Mark';
import type { MarkSpec } from "prosemirror-model";
import InlineMathPlugin from "./inline-math-plugin"

export default class Math extends Mark {

  get name() {
    return 'math';
  }

  get schema(): MarkSpec {
    return {
      inclusive: false,
      toDOM: () => ['math', {"spellCheck": "false"}, 0],
      parseDOM: [{tag: 'math'}],
    };
  }

  get plugins() {
    return [InlineMathPlugin()]
  }
}
