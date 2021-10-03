"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const Node = (options) => (Object.assign({ type: 'node', name: options.name }, options));
exports.Node = Node;
