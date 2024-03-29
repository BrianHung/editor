function JSONtoText(json): string {
	return json.content
		? json.content
				.reduce((text, child) => (child.type == 'text' ? text + child.text : text + JSONtoText(child) + '\n'), '')
				.trim()
		: '\n';
}
