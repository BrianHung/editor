import Extension from './Extension';
import { InputRule } from "prosemirror-inputrules";
export default class Punctuation extends Extension {
    get name(): string;
    inputRules(): InputRule<any>[];
}
//# sourceMappingURL=Punctuation.d.ts.map