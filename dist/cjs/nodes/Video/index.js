"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const Node_js_1 = require("../../Node.js");
const Video = (options) => (0, Node_js_1.Node)(Object.assign({ name: "video", content: "source+", group: "block", parseDOM: [{
            tag: "video",
            getAttrs(dom) {
                console.log("Video parseDOM getAttrs", dom);
                return dom.querySelector("source") ? {} : false;
            },
        }], toDOM() { return ["video", 0]; } }, options));
exports.Video = Video;
