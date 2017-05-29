var names = require('./names');

names.benchmarks.swap = {};

names.benchmarks.swap._2k_f = {name:'swap_2k_f', sort_index:400};
names.benchmarks.swap._2k_L = {name: 'swap_2k_L', sort_index:401}; 			
names.benchmarks.swap._4k_f =	{name:'swap_4k_f', sort_index:402}; 			


names.benchmarks.swap.all = [
	names.benchmarks.swap._2k_f,	//0
	names.benchmarks.swap._2k_L,	//1
	names.benchmarks.swap._4k_f,	//2
];