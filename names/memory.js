var names = require('./names');

names.benchmarks.memory = {};

names.benchmarks.memory._load = {name:'memory_load', sort_index:900};
names.benchmarks.memory._add_1k = {name:'memory_add_1k', sort_index:901};
names.benchmarks.memory._add_2k = {name:'memory_add_2k', sort_index:902};
names.benchmarks.memory._add_3k = {name:'memory_add_3k', sort_index:903};
names.benchmarks.memory._add_4k = {name:'memory_add_4k', sort_index:904};


names.benchmarks.memory.all = [
	names.benchmarks.memory._load,
	names.benchmarks.memory._add_1k,
	names.benchmarks.memory._add_2k,
	names.benchmarks.memory._add_3k,
	names.benchmarks.memory._add_4k,
];