
var names = {};
module.exports = names;
names.benchmarks = {};

//categories of benchmarks
names.benchmarks.categories = {};
names.benchmarks.categories.add = {name: 'add', sort_index: 0};
names.benchmarks.categories.update = {name: 'update', sort_index: 1};
names.benchmarks.categories.replace = {name: 'replace', sort_index: 2};
names.benchmarks.categories.swap = {name: 'swap', sort_index: 3};
names.benchmarks.categories.all = [
	names.benchmarks.categories.add,
	names.benchmarks.categories.update,
	names.benchmarks.categories.replace,
	names.benchmarks.categories.swap,
];

//add
names.benchmarks.add = {};

names.benchmarks.add._500 = {name:'add_500', sort_index:100};
names.benchmarks.add._1k = {name: 'add_1k', sort_index:101}; 			
names.benchmarks.add._2k =	{name:'add_2k', sort_index:102}; 			
names.benchmarks.add._500f_500 =	{name: 'add_500f_500', sort_index:103};
names.benchmarks.add._500f_2k =	{name: 'add_500f_2k', sort_index:104};		
names.benchmarks.add._500f_1k =	{name: 'add_500f_1k', sort_index:105};		
names.benchmarks.add._500m_1k =	{name: 'add_500m_1k', sort_index:106};		
names.benchmarks.add._500L_1k =	{name: 'add_500L_1k', sort_index:107};		

names.benchmarks.add.all = [
	names.benchmarks.add._500 ,			//0
	names.benchmarks.add._1k ,			//1
	names.benchmarks.add._2k ,			//2
	names.benchmarks.add._500f_500 ,	//3
	names.benchmarks.add._500f_2k ,		//4
	names.benchmarks.add._500f_1k ,		//5
	names.benchmarks.add._500m_1k ,		//6
	names.benchmarks.add._500L_1k 		//7
];


names.benchmarks.replace = [
	'repl_500', 		//0
	'repl_1k', 			//1
	'repl_2k', 			//2
	'repl_500f_1500',	//3
	'repl_500m_1500',	//4
	'repl_500L_1500',	//5
	'repl_500f_1k',		//6
	'repl_500f_2k',		//7
];

names.frameworks = [
	{name: 'vanilla-js', sort_index: 0},
	{name: 'vanilla-js-keyed', sort_index: 1},
	{name: 'angular-v1.6', sort_index: 2},
	{name: 'angular-v1.6-keyed', sort_index: 3},
	// 'react-js',
	// 'angular-2',
	// 'angular-2-keyed',
	// 'backbone'
];

names.benchmarksToRun = [];
names.frameworksToRun = [];

//preparing names for testing
names.prepare = function(toRun) {
	for(key in toRun) {
		if(key === 'all') {

		}
		else if (key === 'frameworks') {
			if(toRun.frameworks.length > 0) {
				var frams = toRun.frameworks;
				for (var i = 0; i < frams.length; i++) {
					names.frameworksToRun.push(names.frameworks[frams[i]]);
				}
			}
		} else {
			if(toRun[key].length > 0) {
				var benchs = toRun[key];
				for(var i = 0; i < benchs.length; i++ ) {
					names.benchmarksToRun.push(names.benchmarks[key]['all'][benchs[i]]);
				}
			}
		}
	}
}

//names for testing - benchamrks and frameworks
var toRun = {
	add: [0,1,2], 
	replace: [], 
	swap:[], 
	all:false,
	frameworks: [2,3]
};

names.prepare(toRun);


// var allBenchs = [
// 	'add10000', 		//1
// 	'replace1000', 		//2
// 	'replace10000', 	//3
// 	'swap', 			//4
// 	'update', 			//5
// 	'remove', 			//6
// 	'select', 			//7
// 	'clear1000', 		//8
// 	'clear10000', 		//9
// 	'addToBig', 		//10
// 	'mem-load', 		//11
// 	'mem-add1000', 		//12
// 	'mem-add10000'		//13
// 	];