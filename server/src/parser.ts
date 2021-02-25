import {
	CharStreams,
	CommonTokenStream,
	DiagnosticErrorListener,
} from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';
import {
	Diagnostic,
	DiagnosticSeverity,
	_Connection,
	_LanguagesImpl,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { WotppLexer } from './grammar/wotppLexer';
import { WotppListener } from './grammar/wotppListener';
import { WotppParser } from './grammar/wotppParser';
import { WotFile } from './wot_file';
import LSPListener from './LSPListener';
import WotppErrorListener from './ErrorListener';

export function parse(
	file: TextDocument,
	connection: _Connection,
	wotfile: WotFile
) {
	const input = file.getText();
	const chars = CharStreams.fromString(input);

	const lexer = new WotppLexer(chars);
	const tokenStream = new CommonTokenStream(lexer);
	const parser = new WotppParser(tokenStream);
	const errorListener = new WotppErrorListener();
	parser.addErrorListener(errorListener);

	const tree = parser.document();
	wotfile.resetMethods();

	const listener = new LSPListener(wotfile);
	ParseTreeWalker.DEFAULT.walk(listener as WotppListener, tree);

	const diagnostics: Diagnostic[] = [
		...listener.getDiagnostics(),
		...errorListener.getDiagnostics(),
	];

	connection.sendDiagnostics({
		uri: file.uri,
		diagnostics,
	});

	return wotfile;
}
