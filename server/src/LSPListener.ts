import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver/node';
import { WotppLexer } from './grammar/wotppLexer';
import { WotppListener } from './grammar/wotppListener';
import {
	WotppParser,
	DocumentContext,
	FnContext,
	Fn_argsContext,
	Fn_paramsContext,
	Fn_invokeContext,
} from './grammar/wotppParser';
import { Method, MethodIdentifier, WotFile } from './wot_file';
import Stack from './util/stack';

// Implements the ANTLR4 listener class
// The parser executes functions as it enters and leaves certain grammar rules
export default class LSPListener implements WotppListener {
	private _wotfile: WotFile;
	private _currentFunction: Method;
	private _functionStack: Stack<Method>;
	private _diagnostics: Diagnostic[];

	public constructor(wotfile: WotFile) {
		this._wotfile = wotfile;
		this._diagnostics = [];
		this._currentFunction = { name: 'n/a' };
		this._functionStack = new Stack<Method>();
	}

	enterFn(context: FnContext) {
		const newFunc = {
			name: context.fn_name().getToken(WotppParser.IDENTIFIER, 0).text,
			params: [],
		};
		this._functionStack.push(newFunc);
	}

	// Finish function declaration, can now be registered
	exitFn(context: FnContext) {
		const func = this._functionStack.pop();
		if (func?.value) {
			this._wotfile.registerMethod(func.value);
		}
	}

	// Store the parameters
	enterFn_params(context: Fn_paramsContext) {
		context.getTokens(WotppParser.IDENTIFIER).map((token) => {
			//this._currentFunction.params?.push(token.text);
		});
	}

	enterFn_invoke(context: Fn_invokeContext) {
		const fn_name_token = context.getToken(WotppLexer.IDENTIFIER, 0);
		const id: MethodIdentifier = {
			name: fn_name_token.text,
			paramCount: 0,
		};

		// Do a lookup to check if the methods have been previously defined
		// Doing this as it's parsing means that forward declarations are spotted as errors
		if (this._wotfile.methodLookup(id) === undefined) {
			const unknown_fn_error: Diagnostic = {
				severity: DiagnosticSeverity.Error,
				range: {
					start: {
						line: fn_name_token._symbol.line - 1,
						character: fn_name_token._symbol.charPositionInLine,
					},
					end: {
						line: fn_name_token._symbol.line - 1,
						character:
							fn_name_token._symbol.charPositionInLine +
							fn_name_token.text.length,
					},
				},
				message: `${fn_name_token.text} is not a valid function.`,
				source: 'Wot++',
			};
			this._diagnostics.push(unknown_fn_error);
			console.log(id);
		}
	}

	public getDiagnostics() {
		return this._diagnostics;
	}
}
