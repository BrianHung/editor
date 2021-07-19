import type { InputRule } from "prosemirror-inputrules";
import type { Plugin } from "prosemirror-state";
export type Command = (attrs) => (state, dispatch) => any;
export default abstract class Extension {
  options: Record<string, any>;
  constructor(options: Record<string, any> = {}) {
    this.options = {...this.defaultOptions, ...options};
  }
  get type() {
    return "extension";
  }
  get defaultOptions() {
    return {};
  }
  get plugins(): Plugin[] {
    return [];
  }
  keys?(options) {
    return {};
  }
  inputRules?(options): InputRule[] { 
    return [];
  }
  commands?(options): Record<string, Command> | Command;
}