var fs = require('fs');
var resultsCache = []; //there will be objects with results of each benchmark; then it will be stored in file
var fileName = './app3/results.json';

exports.saveResults = saveResults;
function saveResults(traces) {

	for(var i = 0; i < traces.length; i++) {
		var trace = traces[i];

		if(trace.summary) {
			resultsCache.push({
				framework: trace.framework, 
				framework_index: trace.framework_index,
				results: trace.results,
				summary: true,
				category: trace.category,
				category_index: trace.category_index,
			});
		} else {
			var type = (trace.benchmark.indexOf('mem-') > -1 ) ? "MEM" : "CPU";
			resultsCache.push({
				framework: trace.framework, 
				framework_index: trace.framework_index,
				benchmark: trace.benchmark,
				benchmark_index: trace.benchmark_index,
				results: trace.results,
				type: type,
				keyed: trace.keyed,
			});
		}
	}

	writeResults();
}

function writeResults() {
	fs.writeFile(fileName, JSON.stringify(resultsCache), { encoding: "utf8" }, (err) => {
		if(err) {
			return console.error("error while saving benchmark's results in file results.json");  
		}
		console.log("all benchmark's results saved in file \"results.json\""); 
	});
}

exports.saveParsedTraces = saveParsedTraces;
function saveParsedTraces(traces) {
	for(var i = 0; i < traces.length; i++) {
		var log = traces[i];
		var fileName = 'parsed-traces/' + log.framework + '/' + log.benchmark + '.json';

		(function(fn){
			fs.writeFile(fn, JSON.stringify(log.logs), { encoding: "utf8" }, (err) => {
				if(err) {
					return console.error("error while saving traces:" + fn);  
				}
				console.log("trace " + fn + " saved in file."); 
			});
		})(fileName);
	}
}

exports.saveFrames = saveFrames;
function saveFrames(traces) {
	for(var i = 0; i < traces.length; i++) {
		var log = traces[i];
		var fileName = 'parsed-traces/' + log.framework + '/' + log.benchmark + '_frames.json';

		(function(fn){
			fs.writeFile(fn, JSON.stringify(log.frames), { encoding: "utf8" }, (err) => {
				if(err) {
					return console.error("error while saving traces:" + fn);  
				}
				console.log("frames " + fn + " saved in file."); 
			});
		})(fileName);
	}
}
