import { Node } from '@brianhung/editor';
export * from './markdown';

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
export const Text = (options?: Partial<Node>) =>
	Node({
		name: 'text',
		group: 'inline',
		...options,
	});

export default Text;
