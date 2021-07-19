"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Extension {
    constructor(options = {}) {
        this.options = Object.assign(Object.assign({}, this.defaultOptions), options);
    }
    get type() {
        return "extension";
    }
    get defaultOptions() {
        return {};
    }
    get plugins() {
        return [];
    }
    keys(options) {
        return {};
    }
    inputRules(options) {
        return [];
    }
}
exports.default = Extension;
