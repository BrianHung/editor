async function createMarkdownSerializer(nodes, marks) {
	const MarkdownSerializer = (await import('prosemirror-markdown')).MarkdownSerializer;
	return new MarkdownSerializer(nodes, marks);
}
