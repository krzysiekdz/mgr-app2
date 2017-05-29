var names = require('./names');

names.benchmarks.fetch = {};

names.benchmarks.fetch._1k = 	{name: 'fetch_1k', sort_index:501}; 			
names.benchmarks.fetch._2k =	{name:'fetch_2k', sort_index:502}; 			


names.benchmarks.fetch.all = [
	names.benchmarks.fetch._1k,					//0
	names.benchmarks.fetch._2k, 				//1
];