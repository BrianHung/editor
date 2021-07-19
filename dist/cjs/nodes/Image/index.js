"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const utils_1 = require("../../utils");
class Image extends Node_1.default {
    get name() {
        return "image";
    }
    get schema() {
        return {
            attrs: { src: { default: null }, alt: { default: null }, title: { default: null }, align: { default: 'center' } },
            inline: false,
            group: "block",
            draggable: true,
            parseDOM: [{
                    tag: "img[src]",
                    getAttrs(img) {
                        return { src: img.src, alt: img.alt, title: img.title, align: img.dataset.align };
                    }
                }],
            toDOM(node) {
                const _a = utils_1.removeEmptyAttrs(node.attrs), { align } = _a, attrs = __rest(_a, ["align"]);
                return ["img", Object.assign({ 'data-align': align }, attrs)];
            }
        };
    }
    commands({ nodeType }) {
        return attrs => (state, dispatch) => {
            const { selection } = state;
            const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos;
            const node = nodeType.create(attrs);
            const transaction = state.tr.insert(position, node);
            dispatch(transaction);
        };
    }
    get plugins() {
        const uploadImage = this.options.uploadImage;
        return [];
    }
}
exports.default = Image;
