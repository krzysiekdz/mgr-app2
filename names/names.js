
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
	// add: [0,1,2,3,4,5,6,7,8,9,10,11,12,13], 
	// clear: [0,1,2],
	// update: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
	// replace: [0,1,2,3,4,5,6,7,8,9,10,11,12,13], 
	// swap:[0,1,2], 
	// fetch: [0,1],
	load: [0],
	// input: [0,1],
	// edit: [0,1],
	// select: [0,1,2,3],
	// remove: [0,1,2,3],
	// filter: [0,1],
	// search: [0,1,2,3,4,5,6],
	// memory: [0,1,2,3,4],
	// all_benchmarks:true,
	all_frameworks: true,
	// frameworks: []
};

//preparing test cases; test names goes to benchmarksToRun and frameworksToRun
names.prepare(toRun);
