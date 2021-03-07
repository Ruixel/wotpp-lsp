import { UniquenessLevel } from 'vscode-languageserver';
import intrinsic_functions from './IntrinsicFunctions';

export interface Method {
	name: string;
	params?: Parameter[];
	info?: string;
	detail?: string;
	data?: number;
}

export interface Parameter {
	name: string;
}

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

	private _methods: Method[] = intrinsic_functions;
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

		for (const func of intrinsic_functions) {
			this.registerMethod(func);
		}
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
