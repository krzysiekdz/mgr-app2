var names = require('./names');

names.benchmarks.clear = {};

names.benchmarks.clear._500 = {name:'clear_500', sort_index:150};
names.benchmarks.clear._1k = {name: 'clear_1k', sort_index:151}; 			
names.benchmarks.clear._2k =	{name:'clear_2k', sort_index:152}; 			


names.benchmarks.clear.all = [
	names.benchmarks.clear._500,				//0
	names.benchmarks.clear._1k,					//1
	names.benchmarks.clear._2k, 				//2
];