import { Method } from './wot_file';

const intrinsic_functions: Method[] = [
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

export default intrinsic_functions;
