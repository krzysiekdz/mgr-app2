var names = require('./names');

names.benchmarks.remove = {};

names.benchmarks.remove._1k_f = {name: 'remove_1k_f', sort_index:701}; 			
names.benchmarks.remove._1k_L = {name: 'remove_1k_L', sort_index:702}; 			
names.benchmarks.remove._2k_f =	{name:'remove_2k_f', sort_index:703}; 			
names.benchmarks.remove._2k_L =	{name:'remove_2k_L', sort_index:704}; 			


names.benchmarks.remove.all = [
	names.benchmarks.remove._1k_f,		//0
	names.benchmarks.remove._1k_L,		//1
	names.benchmarks.remove._2k_f,		//2
	names.benchmarks.remove._2k_L, 		//3
];