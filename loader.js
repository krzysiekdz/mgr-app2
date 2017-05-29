
var names = require('./names');
var fs = require('fs');

var events = require('events');
var eventEmitter = new events.EventEmitter();

exports.loadTraces = loadTraces;
function loadTraces(onEndFn) {
	var traces = [];
	var benchs = names.benchmarksToRun; //which benchmark's traces we will load
	var frams = names.frameworksToRun; //which frameworks we will load

	for(var i = 0; i < frams.length; i++) {
		for(var j = 0; j < benchs.length; j++) {
			traces.push({
				framework: frams[i].name,
				framework_index: frams[i].sort_index,
				benchmark: benchs[j].name,
				benchmark_index: benchs[j].sort_index,
			});
		}
	}
	// console.log(traces);
	eventEmitter.on('onEnd', onEndFn);
	readTraceFiles(traces);
}

var traceFilesToRead = 0;
function readTraceFiles(traces) {
	traceFilesToRead = traces.length;

	for(var i = 0; i < traces.length; i++) {
		var trace = traces[i];
		var fileName = './traces/' + trace.framework +'/' + trace.benchmark + '.json';

		(function(fn, trace) {
			fs.readFile(fn, (err, data)=> {
				if(err) {
					return console.error(err);
				}
				trace.logs = JSON.parse(data.toString());
				traceFilesToRead--;
				// console.log(traceFilesToRead);
				if(traceFilesToRead === 0)
					eventEmitter.emit('onEnd', traces);
			})
		})(fileName, trace)

	}

}