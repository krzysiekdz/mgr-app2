var names = require('./names');

names.frameworks = {};

names.frameworks.vanilla_keyed = {name: 'vanillajs-keyed', sort_index: 0, path:'http://localhost:8080/vanillajs-keyed/', keyed: true };
names.frameworks.vanilla_nonk = {name: 'vanillajs-non-keyed', sort_index: 1, path: 'http://localhost:8080/vanillajs-non-k/', keyed: false};
names.frameworks.angular1_keyed = {name: 'angularjs1-keyed', sort_index: 2, path:'http://localhost:8080/angularjs1-keyed/', keyed: true };
names.frameworks.angular1_nonk = {name: 'angularjs1-non-keyed', sort_index: 3, path:'http://localhost:8080/angularjs1-non-k/', keyed: false };
names.frameworks.angular2_keyed = {name: 'angularjs2-keyed', sort_index: 4, path:'http://localhost:8080/angularjs2-keyed/', keyed: true };
names.frameworks.angular2_nonk = {name: 'angularjs2-non-keyed', sort_index: 5, path:'http://localhost:8080/angularjs2-non-k/', keyed: false };
names.frameworks.react_keyed = {name: 'reactjs-keyed', sort_index: 6, path:'http://localhost:5001', keyed: true };
names.frameworks.react_nonk = {name: 'reactjs-non-keyed', sort_index: 7, path:'http://localhost:5002', keyed: false };

names.frameworks.all = [
	names.frameworks.vanilla_keyed,
	names.frameworks.vanilla_nonk,
	names.frameworks.angular1_keyed,
	names.frameworks.angular1_nonk,
	names.frameworks.angular2_keyed,
	names.frameworks.angular2_nonk,
	names.frameworks.react_keyed,
	names.frameworks.react_nonk,
];


names.frameworks.isFramework =  function(frm, f1,f2,f3,f4) {
	if((f1 && f1.name === frm) || (f2 && f2.name === frm) || (f3 && f3.name === frm) || (f4 && f4.name === frm)) {
		return true;
	}
	return false;
};

