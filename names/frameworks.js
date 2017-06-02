var names = require('./names');

names.frameworks = {};

names.frameworks.vanilla_nonk = {name: 'vanilla-js', sort_index: 0};
names.frameworks.vanilla_keyed = {name: 'vanilla-js-keyed', sort_index: 1};
names.frameworks.angular1_nonk = {name: 'angular-v1.6', sort_index: 2};
names.frameworks.angular1_keyed = {name: 'angular-v1.6-keyed', sort_index: 3};

names.frameworks.all = [
	names.frameworks.vanilla_nonk,
	names.frameworks.vanilla_keyed,
	names.frameworks.angular1_nonk,
	names.frameworks.angular1_keyed,
	// 'react-js',
	// 'angular-2',
	// 'angular-2-keyed',
	// 'backbone'
];


names.frameworks.isFramework =  function(frm, f1,f2,f3,f4) {
	if((f1 && f1.name === frm) || (f2 && f2.name === frm) || (f3 && f3.name === frm) || (f4 && f4.name === frm)) {
		return true;
	}
	return false;
};

