import { Plugin } from 'prosemirror-state';
import { MarkViewConstructor, NodeViewConstructor } from 'prosemirror-view';

export const defineNodeViews = (nodeViews: { [node: string]: NodeViewConstructor }) =>
	new Plugin<any>({
		props: {
			nodeViews,
		},
	});

export const defineMarkViews = (markViews: { [mark: string]: MarkViewConstructor }) =>
	new Plugin<any>({
		props: {
			markViews,
		},
	});
