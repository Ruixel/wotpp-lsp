import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { WotppLexer } from './grammar/wotppLexer';
import { WotppListener } from './grammar/wotppListener';
import { WotppParser, DocumentContext, FnContext } from './grammar/wotppParser';
import { WotFile } from './wot_file';

export function parse(file: TextDocument): WotFile {
	const input = file.getText();
	const chars = CharStreams.fromString(input);

	const lexer = new WotppLexer(chars);
	const tokenStream = new CommonTokenStream(lexer);
	const parser = new WotppParser(tokenStream);

	const tree = parser.document();
	const wotfile = new WotFile();
	console.log('hey');

	class TestListener implements WotppListener {
		enterFn(context: FnContext) {
			wotfile.registerMethod(
				context.fn_name().getToken(WotppParser.IDENTIFIER, 0).text
			);
		}
	}

	const listener: WotppListener = new TestListener();
	ParseTreeWalker.DEFAULT.walk(listener, tree);

	return wotfile;
}
