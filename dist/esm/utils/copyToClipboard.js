var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const copyToClipboard = (string) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state } = yield navigator.permissions.query({ name: 'clipboard-write' });
        if (state !== 'granted') {
            throw new Error('Clipboard permission not granted');
        }
        yield navigator.clipboard.writeText(string);
    }
    catch (_a) {
        const textArea = document.createElement('textarea');
        textArea.value = string;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
});
export default copyToClipboard;
