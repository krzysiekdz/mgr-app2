var file = require('./file');
var loader = require('./loader');
var parser = require('./parser');
var resultworker = require('./resultWorker');


function traceProcessor() {

	loader.loadTraces(function(traces) { //callback function, loaded traces returned
		console.log('trace proc');
		console.log(traces.length);
		// parser.parse(traces);//>> traces.frames

		// resultworker.results(traces);// >> traces.results

		// file.saveParsedTraces(traces);
		// file.saveFrames(traces);
		// file.saveResults(traces);
	});
}

traceProcessor();








