var names = require('./names');

names.benchmarks.replace = {};

names.benchmarks.replace._500 = {name:'replace_500', sort_index:300};
names.benchmarks.replace._1k = {name: 'replace_1k', sort_index:301}; 			
names.benchmarks.replace._2k =	{name:'replace_2k', sort_index:302}; 			
names.benchmarks.replace._500f_1_5k =	{name: 'replace_500f_1_5k', sort_index:303};
names.benchmarks.replace._500m_1_5k =	{name: 'replace_500m_1_5k', sort_index:304};		
names.benchmarks.replace._500L_1_5k =	{name: 'replace_500L_1_5k', sort_index:305};		
names.benchmarks.replace._500f_1k =	{name: 'replace_500f_1k', sort_index:306};		
names.benchmarks.replace._500f_2k =	{name: 'replace_500f_2k', sort_index:307};
names.benchmarks.replace._1f_1k =	{name: 'replace_1f_1k', sort_index:308};		
names.benchmarks.replace._2f_1k =	{name: 'replace_2f_1k', sort_index:309};	
names.benchmarks.replace._1f_2k =	{name: 'replace_1f_2k', sort_index:310};	
names.benchmarks.replace._1L_2k =	{name: 'replace_1L_2k', sort_index:311};	
names.benchmarks.replace._500f_3k =	{name: 'replace_500f_3k', sort_index:312};	
names.benchmarks.replace._500f_4k =	{name: 'replace_500f_4k', sort_index:313};	


names.benchmarks.replace.all = [
	names.benchmarks.replace._500,				//0
	names.benchmarks.replace._1k,				//1
	names.benchmarks.replace._2k, 				//2
	names.benchmarks.replace._500f_1_5k,		//3
	names.benchmarks.replace._500m_1_5k,		//4
	names.benchmarks.replace._500L_1_5k,		//5
	names.benchmarks.replace._500f_1k,			//6
	names.benchmarks.replace._500f_2k,			//7
	names.benchmarks.replace._1f_1k,			//8
	names.benchmarks.replace._2f_1k,			//9
	names.benchmarks.replace._1f_2k,			//10
	names.benchmarks.replace._1L_2k,			//11
	names.benchmarks.replace._500f_3k,			//12
	names.benchmarks.replace._500f_4k,			//13
];