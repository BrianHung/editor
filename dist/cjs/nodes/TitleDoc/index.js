"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleDoc = void 0;
const Node_js_1 = require("../../Node.js");
const TitleDoc = (options) => (0, Node_js_1.Node)(Object.assign({ name: 'titledoc', content: 'title block+' }, options));
exports.TitleDoc = TitleDoc;
