var names = require('./names');

names.benchmarks.categories = {};

names.benchmarks.categories.add = {name: 'add', sort_index: 0};
names.benchmarks.categories.clear = {name: 'clear', sort_index: 1};
names.benchmarks.categories.update = {name: 'update', sort_index: 2};
names.benchmarks.categories.replace = {name: 'replace', sort_index: 3};
names.benchmarks.categories.swap = {name: 'swap', sort_index: 4};
names.benchmarks.categories.fetch = {name: 'fetch', sort_index:5 };
names.benchmarks.categories.load = {name: 'load', sort_index:6 };
names.benchmarks.categories.input = {name: 'input', sort_index:7 };
names.benchmarks.categories.edit = {name: 'edit', sort_index:8 };
names.benchmarks.categories.select = {name: 'select', sort_index:9 };
names.benchmarks.categories.remove = {name: 'remove', sort_index:10 };
names.benchmarks.categories.filter = {name: 'filter', sort_index:11 };
names.benchmarks.categories.search = {name: 'search', sort_index:12 };
names.benchmarks.categories.memory = {name: 'memory', sort_index:13 };

names.benchmarks.categories.all = [//14
	names.benchmarks.categories.add,		//0
	names.benchmarks.categories.clear,		//1
	names.benchmarks.categories.update,		//2
	names.benchmarks.categories.replace,	//3
	names.benchmarks.categories.swap,		//4
	names.benchmarks.categories.fetch,		//5
	names.benchmarks.categories.load,		//6
	names.benchmarks.categories.input,		//7
	names.benchmarks.categories.edit,		//8
	names.benchmarks.categories.select,		//9
	names.benchmarks.categories.remove,		//10
	names.benchmarks.categories.filter,		//11
	names.benchmarks.categories.search,		//12
	names.benchmarks.categories.memory,		//13
];
