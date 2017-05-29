var names = require('./names');

names.benchmarks.filter = {};

names.benchmarks.filter._1k = {name: 'filter_1k', sort_index:800}; 			
names.benchmarks.filter._2k =	{name:'filter_2k', sort_index:801}; 			


names.benchmarks.filter.all = [
	names.benchmarks.filter._1k,				//0
	names.benchmarks.filter._2k, 				//1
];