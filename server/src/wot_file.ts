interface Method {
	name: string;
}

export class WotFile {
	public fileUri: string;

	private _methods: Method[] = [];

	public registerMethod(method_name: string) {
		const newMethod: Method = { name: method_name };
		this._methods.push(newMethod);
	}

	public methodLookup() {
		return this._methods;
	}

	constructor() {
		this.fileUri = 'idk';
	}
}
