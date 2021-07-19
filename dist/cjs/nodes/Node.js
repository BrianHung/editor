"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Extension_1 = __importDefault(require("../extensions/Extension"));
class Node extends Extension_1.default {
    constructor(options) {
        super(options);
    }
    get type() {
        return "node";
    }
}
exports.default = Node;
