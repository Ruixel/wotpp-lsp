import { RecognitionException, Recognizer, Token } from 'antlr4ts';
import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver/node';
import { WotppParser } from './grammar/WotppParser';

export default class WotppErrorListener {
	private _diagnostics: Diagnostic[];

	public constructor() {
		this._diagnostics = [];
	}

	syntaxError<T extends Token>(
		recognizer: Recognizer<T, any>,
		offendingSymbol: T | undefined,
		line: number,
		charPositionInLine: number,
		msg: string,
		e: RecognitionException | undefined
	): void {
		let start_pos = charPositionInLine;
		let end_pos = charPositionInLine;

		if (offendingSymbol !== undefined) {
			start_pos = offendingSymbol.charPositionInLine;
			//end_pos = offendingSymbol.;
		}

		const syntax_error: Diagnostic = {
			severity: DiagnosticSeverity.Error,
			range: {
				start: {
					line: line - 1,
					character: charPositionInLine,
				},
				end: {
					line: line - 1,
					character: charPositionInLine + 100,
				},
			},
			message: `${msg}`,
			source: 'Syntax Error',
		};
		this._diagnostics.push(syntax_error);
		console.log(`err: ${msg}`);

		/*switch (e?.context?.ruleIndex) {
			case WotppParser.RULE_block:
				console.log('Missing closing bracket.');
				break;

			default:
				break;
		}*/
	}

	public getDiagnostics() {
		return this._diagnostics;
	}
}
