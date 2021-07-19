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
import Node from "../Node";
import { removeEmptyAttrs } from "../../utils";
export default class Image extends Node {
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
                const _a = removeEmptyAttrs(node.attrs), { align } = _a, attrs = __rest(_a, ["align"]);
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
