import { Plugin } from "prosemirror-state";
import getDataTransferFiles from "../lib/getDataTransferFiles";
export const MarkdownDragDropPlugin = new Plugin({
    props: {
        handleDOMEvents: {
            drop(view, event) {
                const files = getDataTransferFiles(event);
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
export default MarkdownDragDropPlugin;
