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

export default class LSPListener implements WotppListener {
	private _wotfile: WotFile;
	private _currentFunction: Method;
	private _diagnostics: Diagnostic[];

	public constructor(wotfile: WotFile) {
		this._wotfile = wotfile;
		this._diagnostics = [];
		this._currentFunction = { name: 'n/a' };
	}

	enterFn(context: FnContext) {
		this._currentFunction = {
			name: context.fn_name().getToken(WotppParser.IDENTIFIER, 0).text,
			params: [],
		};
	}

	exitFn(context: FnContext) {
		this._wotfile.registerMethod(this._currentFunction);
	}

	enterFn_params(context: Fn_paramsContext) {
		context.getTokens(WotppParser.IDENTIFIER).map((token) => {
			this._currentFunction.params?.push(token.text);
			//console.log(`args: ${token.text}`);
		});
	}

	enterFn_invoke(context: Fn_invokeContext) {
		const fn_name_token = context.getToken(WotppLexer.IDENTIFIER, 0);
		const id: MethodIdentifier = {
			name: fn_name_token.text,
			paramCount: 0,
		};

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
