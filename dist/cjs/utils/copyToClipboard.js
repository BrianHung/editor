"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyToClipboard = void 0;
function copyToClipboard(text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { state } = yield navigator.permissions.query({ name: 'clipboard-write' });
            if (state !== 'granted') {
                throw new Error('Clipboard permission not granted');
            }
            return navigator.clipboard.writeText(text);
        }
        catch (_a) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    });
}
exports.copyToClipboard = copyToClipboard;
