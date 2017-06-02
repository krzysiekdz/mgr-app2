
var names = {};
module.exports = names;
names.benchmarks = {};

//categories of benchmarks
require('./categories');

//loading benchmarks names
require('./add');
require('./clear');
require('./update');
require('./replace');
require('./swap');
require('./fetch');
require('./load');
require('./input');
require('./edit');
require('./select');
require('./remove');
require('./filter');
require('./search');
require('./memory');

//frameworks
require('./frameworks');

//function preparing names for testing
require('./prepare');

//names for testing - benchamrks and frameworks
var toRun = {
	add: [], 
	clear: [],
	update: [],
	replace: [], 
	swap:[], 
	fetch: [],
	load: [],
	input: [],
	edit: [],
	select: [],
	remove: [0],
	filter: [],
	search: [],
	memory: [],
	all_benchmarks:false,
	all_frameworks: true,
	frameworks: []
};

//preparing test cases; test names goes to benchmarksToRun and frameworksToRun
names.prepare(toRun);
