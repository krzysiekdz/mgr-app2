var names = require('./names');

names.benchmarks.input = {};

names.benchmarks.input._1k = {name: 'input_1k', sort_index:601}; 			
names.benchmarks.input._2k =	{name:'input_2k', sort_index:602}; 			


names.benchmarks.input.all = [
	names.benchmarks.input._1k,					//0
	names.benchmarks.input._2k, 				//1
];