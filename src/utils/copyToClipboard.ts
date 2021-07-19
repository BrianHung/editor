const copyToClipboard = async (string: string) => {
  try {
    // Try to use the Async Clipboard API with fallback to the legacy approach.
    // @ts-ignore
    const {state} = await navigator.permissions.query({name: 'clipboard-write'});
    if (state !== 'granted') { throw new Error('Clipboard permission not granted'); }
    await navigator.clipboard.writeText(string);
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = string;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

export default copyToClipboard;