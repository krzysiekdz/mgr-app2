
var names = require('./names/names');
var fs = require('fs');

var events = require('events');
// var eventEmitter = new events.EventEmitter();

var fn = undefined;

exports.loadTraces = loadTraces;
function loadTraces(onEndFn) {
	var traces = [];
	var benchs = names.benchmarksToRun; //which benchmark's traces we will load
	var frams = names.frameworksToRun; //which frameworks we will load

	for(var i = 0; i < frams.length; i++) {
		for(var j = 0; j < benchs.length; j++) {
			try {
				traces.push({
					framework: frams[i].name,
					framework_index: frams[i].sort_index,
					benchmark: benchs[j].name,
					bench_descr: benchs[j].descr,
					omit_summary: benchs[j].omit_summary,
					benchmark_index: benchs[j].sort_index,
					memory: (benchs[j].name.indexOf('memory') > -1 ) ? true:false,
					// load: (benchs[j].name.indexOf('load') > -1 ) ? true:false,
					keyed: frams[i].keyed,
				});
			} catch (e){
				console.log('error while loading:', benchs[j]);
			}
		}
	}
	// eventEmitter.on('onEnd', onEndFn);
	fn = onEndFn;
	readTraceFiles(traces);
}


var traceFilesToRead = 0;
var readCount = 0;

function readTraceFiles(traces) {
	traceFilesToRead = traces.length;
	console.log('all possible traces to read:',traceFilesToRead);

	for(var i = 0; i < traces.length; i++) {
		var trace = traces[i];
		var fileName = './traces/' + trace.framework +'/' + trace.benchmark + '.json';

		(function(fn, trace) {
			fs.readFile(fn, (err, data)=> {
				if(err) {
					traceFilesToRead--;
					return;
				}
				trace.logs = JSON.parse(data.toString());
				traceFilesToRead--;
				readCount++;
				if(traceFilesToRead === 0)
					beforeEnd(traces);
			})
		})(fileName, trace)
	}
}

function beforeEnd(traces) {
	console.log('traces has read:', readCount);
	clearEmptyTraces(traces);
	// eventEmitter.emit('onEnd', traces);
	fn(traces);
}

function clearEmptyTraces(traces) {
	for(var i = traces.length-1 ; i >= 0 ; i--) {
		if(traces[i].logs === undefined) {
			traces.splice(i, 1);
		}
	}
}