var names = require('./names');

names.benchmarks.update = {};

names.benchmarks.update._500 = {name:'update_500', sort_index:200};
names.benchmarks.update._1k = {name: 'update_1k', sort_index:201}; 			
names.benchmarks.update._2k =	{name:'update_2k', sort_index:202}; 			
names.benchmarks.update._500f_1_5k =	{name: 'update_500f_1_5k', sort_index:203};
names.benchmarks.update._500m_1_5k =	{name: 'update_500m_1_5k', sort_index:204};		
names.benchmarks.update._500L_1_5k =	{name: 'update_500L_1_5k', sort_index:205};		
names.benchmarks.update._500f_1k =	{name: 'update_500f_1k', sort_index:206};		
names.benchmarks.update._500f_2k =	{name: 'update_500f_2k', sort_index:207};
names.benchmarks.update._1f_1k =	{name: 'update_1f_1k', sort_index:208};		
names.benchmarks.update._2f_1k =	{name: 'update_2f_1k', sort_index:209};	
names.benchmarks.update._1f_2k =	{name: 'update_1f_2k', sort_index:210};	
names.benchmarks.update._1L_2k =	{name: 'update_1L_2k', sort_index:211};	
names.benchmarks.update._500f_3k =	{name: 'update_500f_3k', sort_index:212};	
names.benchmarks.update._500f_4k =	{name: 'update_500f_4k', sort_index:213};	

names.benchmarks.update.partial_evr2_1k =	{name: 'update_partial_evr2_1k', sort_index:214};	
names.benchmarks.update.partial_evr3_1_5k =	{name: 'update_partial_evr3_1_5k', sort_index:215};	
names.benchmarks.update.partial_evr4_2k =	{name: 'update_partial_evr4_2k', sort_index:216};	

names.benchmarks.update.all = [
	names.benchmarks.update._500,				//0
	names.benchmarks.update._1k,				//1
	names.benchmarks.update._2k, 				//2
	names.benchmarks.update._500f_1_5k,			//3
	names.benchmarks.update._500m_1_5k,			//4
	names.benchmarks.update._500L_1_5k,			//5
	names.benchmarks.update._500f_1k,			//6
	names.benchmarks.update._500f_2k,			//7
	names.benchmarks.update._1f_1k,				//8
	names.benchmarks.update._2f_1k,				//9
	names.benchmarks.update._1f_2k,				//10
	names.benchmarks.update._1L_2k,				//11
	names.benchmarks.update._500f_3k,			//12
	names.benchmarks.update._500f_4k,			//13

	names.benchmarks.update.partial_evr2_1k,		//14
	names.benchmarks.update.partial_evr3_1_5k,		//15
	names.benchmarks.update.partial_evr4_2k,		//16
];