import { Plugin } from 'prosemirror-state';
import getDataTransferFiles from '../lib/getDataTransferFiles';

export const MarkdownDragDropPlugin = new Plugin({
	props: {
		handleDOMEvents: {
			drop(view, event) {
				// console.log("drop", !event.dataTransfer, event.dataTransfer.files, event.dataTransfer.files.length)
				const files = getDataTransferFiles(event);
				if (files && files.length === 1) {
					event.preventDefault();
					const reader = new FileReader();
					reader.onload = event => {
						//console.log(event.target.result, view, defaultMarkdownParser.parse(event.target.result));
					};
					reader.readAsText(files[0]);
				}
				// const posAtCoords = view.posAtCoords({left: event.clientX, top: event.clientY});
				return true;
			},
		},
	},
});

export default MarkdownDragDropPlugin;
