var names = require('./names');

names.benchmarks.add = {};

names.benchmarks.add._500 = {name:'add_500', sort_index:100, index: 0, descr: "utworzenie 500 elementów"};
names.benchmarks.add._1k = {name: 'add_1k', sort_index:101, index: 1, descr: "utworzenie 1tys elementów"}; 			
names.benchmarks.add._2k =	{name:'add_2k', sort_index:102, index: 2, descr: "utworzenie 2tys elementów"}; 		

names.benchmarks.add._500f_1k =	{name: 'add_500f_1k', sort_index:103, index: 5, descr: "dodanie 500 el na początek przy istniejącym 1tys el"};		
names.benchmarks.add._500f_3k =	{name: 'add_500f_3k', sort_index:104, index: 8, descr: "dodanie 500 el na początek przy istniejących 3tys el"};	

names.benchmarks.add._500m_1k =	{name: 'add_500m_1k', sort_index:105, index: 6, descr: "dodanie 500 el w środek przy istniejącym 1tys el"};		
names.benchmarks.add._500L_1k =	{name: 'add_500L_1k', sort_index:106, index: 7, descr: "dodanie 500 el na koniec przy istniejącym 1tys el"};		
names.benchmarks.add._500m_3k =	{name: 'add_500m_3k', sort_index:107, index: 6, descr: "dodanie 500 el w środek przy istniejących 3tys el"};		
names.benchmarks.add._500L_3k =	{name: 'add_500L_3k', sort_index:108, index: 7, descr: "dodanie 500 el na koniec przy istniejących 3tys el"};		

names.benchmarks.add._1f_1k =	{name: 'add_1f_1k', sort_index:110, index: 10, descr: "dodanie 1 el na początek przy istniejącym 1tys el", omit_summary: true};	
names.benchmarks.add._1L_1k =	{name: 'add_1L_1k', sort_index:111, index: 11, descr: "dodanie 1 el na koniec przy istniejącym 1tys el", omit_summary: true};	
names.benchmarks.add._2f_1k =	{name: 'add_2f_1k', sort_index:112, index: 12, descr: "dodanie 2 el na początek przy istniejącym 1tys el", omit_summary: true};	
names.benchmarks.add._2L_1k =	{name: 'add_2L_1k', sort_index:113, index: 13, descr: "dodanie 2 el na koniec przy istniejącym 1tys el", omit_summary: true};	

names.benchmarks.add.all = [
	names.benchmarks.add._500 ,			//0
	names.benchmarks.add._1k ,			//1
	names.benchmarks.add._2k ,			//2

	names.benchmarks.add._500f_1k ,		//3
	names.benchmarks.add._500f_3k, 		//4

	names.benchmarks.add._500m_1k ,		//5
	names.benchmarks.add._500L_1k, 		//6
	names.benchmarks.add._500m_3k ,		//7
	names.benchmarks.add._500L_3k, 		//8

	names.benchmarks.add._1f_1k, 		//9
	names.benchmarks.add._1L_1k, 		//10
	names.benchmarks.add._2f_1k, 		//11
	names.benchmarks.add._2L_1k, 		//12
];