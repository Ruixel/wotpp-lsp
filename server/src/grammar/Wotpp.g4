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
	: 'let' fn_name expression
	;

fn_name 
	: IDENTIFIER
	;

expression
	: string
	;

statement
	: fn
	| expression
	;

document
	: statement*
	;

// skip spaces, tabs, newlines
WHITESPACE : [ \t\r\n]+ -> skip ; 
