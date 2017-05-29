var names = require('./names');

names.benchmarksToRun = [];
names.frameworksToRun = [];

names.prepare = function(toRun) {
	for(key in toRun) {
		if(key === 'all') {

		}
		else if (key === 'frameworks') {
			if(toRun.frameworks.length > 0) {
				var frams = toRun.frameworks;
				for (var i = 0; i < frams.length; i++) {
					names.frameworksToRun.push(names.frameworks[frams[i]]);
				}
			}
		} else {
			if(toRun[key].length > 0) {//benchmarks array
				var benchs = toRun[key];
				for(var i = 0; i < benchs.length; i++ ) {
					names.benchmarksToRun.push(names.benchmarks[key]['all'][benchs[i]]);
				}
			}
		}
	}
}