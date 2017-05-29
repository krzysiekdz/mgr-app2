var names = require('./names');

names.benchmarks.add = {};

names.benchmarks.add._500 = {name:'add_500', sort_index:100};
names.benchmarks.add._1k = {name: 'add_1k', sort_index:101}; 			
names.benchmarks.add._2k =	{name:'add_2k', sort_index:102}; 			
names.benchmarks.add._500f_500 =	{name: 'add_500f_500', sort_index:103};
names.benchmarks.add._500f_2k =	{name: 'add_500f_2k', sort_index:104};		
names.benchmarks.add._500f_1k =	{name: 'add_500f_1k', sort_index:105};		
names.benchmarks.add._500m_1k =	{name: 'add_500m_1k', sort_index:106};		
names.benchmarks.add._500L_1k =	{name: 'add_500L_1k', sort_index:107};		
names.benchmarks.add._500f_3k =	{name: 'add_500f_3k', sort_index:108};	
names.benchmarks.add._500f_4k =	{name: 'add_500f_4k', sort_index:109};	
names.benchmarks.add._1f_1k =	{name: 'add_1f_1k', sort_index:110};	
names.benchmarks.add._1L_1k =	{name: 'add_1L_1k', sort_index:111};	
names.benchmarks.add._2f_1k =	{name: 'add_2f_1k', sort_index:112};	
names.benchmarks.add._2L_1k =	{name: 'add_2L_1k', sort_index:113};	

names.benchmarks.add.all = [
	names.benchmarks.add._500 ,			//0
	names.benchmarks.add._1k ,			//1
	names.benchmarks.add._2k ,			//2
	names.benchmarks.add._500f_500 ,	//3
	names.benchmarks.add._500f_2k ,		//4
	names.benchmarks.add._500f_1k ,		//5
	names.benchmarks.add._500m_1k ,		//6
	names.benchmarks.add._500L_1k, 		//7
	names.benchmarks.add._500f_3k, 		//8
	names.benchmarks.add._500f_4k, 		//9
	names.benchmarks.add._1f_1k, 		//10
	names.benchmarks.add._1L_1k, 		//11
	names.benchmarks.add._2f_1k, 		//12
	names.benchmarks.add._2L_1k, 		//13
];