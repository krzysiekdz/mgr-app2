var names = require('./names');

names.benchmarksToRun = [];
names.frameworksToRun = [];

names.prepare = function(toRun) {
	for(key in toRun) {
		if(key === 'all_benchmarks' && toRun[key]) { //all benchmarks
			var cats = names.benchmarks.categories.all;
			var all_b = [];
			for(var i = 0; i < cats.length; i++ ) { //for every benchmark category
				var cat = cats[i];
				all_b = all_b.concat(names.benchmarks[cat.name].all);
			}
			names.benchmarksToRun = all_b;
			console.log('all benchmarks count:', all_b.length);
		} 
		else if(key === 'all_frameworks' && toRun[key]) { //all frameworks
			names.frameworksToRun = names.frameworks.all;
			console.log('all frameworks count:', names.frameworks.all.length);
		} 
		else if (key === 'frameworks' && !toRun.all_frameworks) { //frameworks array
			if(toRun.frameworks.length > 0) {
				var frams = toRun.frameworks;
				for (var i = 0; i < frams.length; i++) {
					names.frameworksToRun.push(names.frameworks.all[frams[i]]);
				}
			}
		} 
		else if (!toRun.all_benchmarks) {
			if(toRun[key].length > 0) {//benchmarks array
				var benchs = toRun[key];
				for(var i = 0; i < benchs.length; i++ ) {
					var bench = names.benchmarks[key]['all'][benchs[i]];
					if(bench !== undefined)
						names.benchmarksToRun.push(bench);
				}
			}
		}
	}
}