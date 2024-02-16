export function gatherFromSpec(obj: Record<string, any>, key: string) {
	let result = {};
	for (let name in obj) {
		let value = obj[name].spec[key];
		if (value) result[name] = value;
	}
	return result;
}
