"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        tag: "div.highlighter-rouge",
        preserveWhitespace: "full",
        getAttrs(dom) {
            let [match, lang] = /language-([a-z\/+#-.]*)/.exec(dom.className) || [];
            return match ? { lang } : {};
        }
    },
    {
        tag: "div.highlight",
        preserveWhitespace: "full",
        getAttrs(dom) {
            let [match, lang] = /highlight highlight-source-([a-z\/+#-.]*)/.exec(dom.className) || [];
            return match ? { lang } : {};
        }
    },
    {
        tag: "pre.hljs",
        preserveWhitespace: "full",
        getAttrs(dom) {
            let [match, lang] = /hljs ([a-z\/+#-.]*)/.exec(dom.className) || /lang-([a-z\/+#-.]*)/.exec(dom.className) || [];
            return match ? { lang } : {};
        }
    },
    {
        tag: "pre",
        preserveWhitespace: "full",
        getAttrs(dom) {
            var _a;
            let className = `${dom.className} ${((_a = dom.firstElementChild) === null || _a === void 0 ? void 0 : _a.className) || ""}`;
            let [match, lang] = /hljs ([a-z\/+#-.]*)/.exec(className) || /lang-([a-z\/+#-.]*)/.exec(className) || /language-([a-z\/+#-.]*)/.exec(className) || [];
            return match ? { lang } : {};
        }
    },
    {
        tag: "pre",
        preserveWhitespace: "full"
    },
];
