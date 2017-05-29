var names = require('./names');

names.benchmarks.select = {};

names.benchmarks.select._1k_f = {name: 'select_1k_f', sort_index:705}; 			
names.benchmarks.select._1k_L = {name: 'select_1k_L', sort_index:706}; 			
names.benchmarks.select._2k_f =	{name:'select_2k_f', sort_index:707}; 			
names.benchmarks.select._2k_L =	{name:'select_2k_L', sort_index:708}; 			


names.benchmarks.select.all = [
	names.benchmarks.select._1k_f,		//0
	names.benchmarks.select._1k_L,		//1
	names.benchmarks.select._2k_f,		//2
	names.benchmarks.select._2k_L, 		//3
];