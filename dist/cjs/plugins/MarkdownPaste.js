"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownDragDropPlugin = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const getDataTransferFiles_1 = __importDefault(require("../lib/getDataTransferFiles"));
exports.MarkdownDragDropPlugin = new prosemirror_state_1.Plugin({
    props: {
        handleDOMEvents: {
            drop(view, event) {
                const files = (0, getDataTransferFiles_1.default)(event);
                if (files && files.length === 1) {
                    event.preventDefault();
                    const reader = new FileReader();
                    reader.onload = event => {
                    };
                    reader.readAsText(files[0]);
                }
                return true;
            }
        }
    }
});
exports.default = exports.MarkdownDragDropPlugin;
