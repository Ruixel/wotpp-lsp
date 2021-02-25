import { UniquenessLevel } from 'vscode-languageserver';

export interface Method {
	name: string;
	params?: string[];
	info?: string;
	detail?: string;
	data?: number;
}

const intrinsic_methods: Method[] = [
	{
		name: 'run',
		data: 1,
		info: 'run(command)',
		detail: '(Security Warning) Runs shell commands.',
	},
	{
		name: 'file',
		data: 2,
		info: 'file(file_location)',
		detail: 'Returns a string with the contents of a given file.',
	},
	{
		name: 'eval',
		data: 3,
		info: 'eval(code)',
		detail:
			'Evaluates a piece of code in w++ and returns the result. An error is thrown if encountered.',
	},
	{
		name: 'assert',
		data: 4,
		info: 'assert(a, b)',
		detail: 'Tests if two strings are equal. If not, an error is thrown.',
	},
	{
		name: 'source',
		data: 5,
		info: 'source(file_location)',
		detail: 'Imports code from another w++ file.',
	},
	{
		name: 'escape',
		data: 6,
		info: 'escape(str)',
		detail: 'Returns an escaped string.',
	},
	{
		name: 'pipe',
		data: 7,
		info: 'pipe(command, input)',
		detail:
			'The input parameter is used as the input stream for a given shell command.',
	},
	{
		name: 'error',
		data: 8,
		info: 'error(message)',
		detail: 'Throws an error with a given message.',
	},
	{
		name: 'log',
		data: 9,
		info: 'log(message)',
		detail: 'Outputs a message through the standard error stream.',
	},
];

export interface MethodIdentifier {
	name: string;
	paramCount: number;
}

function methodIdToString(methodId: MethodIdentifier) {
	return methodId.name + '#' + methodId.paramCount;
}

function methodToString(method: Method) {
	if (method.params === undefined) return method.name + '#0';
	else return method.name + '#' + method.params?.length;
}

export class WotFile {
	public fileUri: string;

	private _methods: Method[] = intrinsic_methods;
	private _methodMap = new Map<string, Method>();

	public registerMethod(method: Method) {
		console.log(`Registering: ${methodToString(method)}`);

		if (!this._methodMap.has(methodToString(method))) {
			method.data = this._methods.length + 1;

			this._methodMap.set(methodToString(method), method);
			this._methods.push(method);
		}
	}

	public resetMethods() {
		this._methods = [];
		this._methodMap.clear();
	}

	/*public methodLookup(itemNumber?: number): Method | null {
		if (itemNumber && itemNumber < this._methods.length) {
			return this._methods[itemNumber];
		}
		return null;
	}*/

	public methodLookup(id: MethodIdentifier): Method | undefined {
		const name = methodIdToString(id);
		return this._methodMap.get(name);
	}

	public getMethods() {
		return this._methods;
	}

	constructor() {
		this.fileUri = 'idk';
	}
}
