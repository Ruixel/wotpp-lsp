grammar Wotpp;

IDENTIFIER
	: [a-zA-Z_][a-zA-Z_0-9]*
	;

// String stuff
BASIC_STRING
	: '"' ( ~('\\'|'"') )* '"'
    ;

string
	: BASIC_STRING
	;

// Function stuff
fn
	: 'let' fn_name fn_params? expression
	;

fn_name 
	: IDENTIFIER
	;

fn_params
	: '(' IDENTIFIER ( ',' IDENTIFIER )* ')'
	;

fn_args
	: '(' expression ( ',' expression )* ')'
	;

fn_invoke
	: IDENTIFIER fn_args?
	;

block
	: '{' (statement)* expression '}'
	;

concat
	: expression '..' expression
	;

expression
	: fn_invoke
	| string
	| block
	;

statement
	: fn
	| expression
	;

document
	: statement*
	;

// skip spaces, tabs, newlines
WHITESPACE 
	: [ \t\r\n]+ -> skip 
	; 

// Comment stuff
BLOCK_COMMENT
	: '#[' .*? ']' -> channel(HIDDEN)  // #[ multi-line comment ]
	;

LINE_COMMENT
	: '#' .*? '\n' -> channel(HIDDEN)  // # comment
	;
