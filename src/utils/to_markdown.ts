async function createMarkdownSerializer(nodes, marks) {
  const MarkdownSerializer = (await import('prosemirror-markdown')).MarkdownSerializer
  return new MarkdownSerializer(nodes, marks)
}

function gatherToMarkdown(obj) {
  let result = {}
  for (let name in obj) {
    let toMarkdown = obj[name].toMarkdown
    if (toMarkdown) result[name] = toMarkdown
  }
  return result
}