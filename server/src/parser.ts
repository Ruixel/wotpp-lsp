import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';

import { WotppLexer } from './grammar/wotppLexer';
import { WotppListener } from './grammar/wotppListener';
import { WotppParser, RContext } from './grammar/wotppParser';

export function parse() {
	const input = 'let jack';
	const chars = CharStreams.fromString(input);

	const lexer = new WotppLexer(chars);
	const tokenStream = new CommonTokenStream(lexer);
	const parser = new WotppParser(tokenStream);

	const tree = parser.r();

	class TestListener implements WotppListener {
		enterR(context: RContext) {
			context.getTokens(WotppParser.ID).map((token) => {
				console.log(token.text);
			});
		}
	}

	const listener: WotppListener = new TestListener();
	ParseTreeWalker.DEFAULT.walk(listener, tree);
}
