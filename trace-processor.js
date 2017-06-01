var file = require('./file');
var loader = require('./loader');
var parser = require('./parser');
var resultworker = require('./resultWorker');


function traceProcessor() {

	//sprawdzic, czy parser bedzie czytal pliki po dopisywaniu do nich - wtedy sa rozne instancje ChromeRenderer - ale nie powinno to miec raczej roznicy

	loader.loadTraces(function(traces) { //callback function, loaded traces returned
		// console.log('trace proc',traces.length); //loader nie czyta kilku plikow - czyta 46 a powinien 50 - spr pozniej czemu

		parser.parse(traces);//>> traces.frames

		// resultworker.results(traces);// >> traces.results

		file.saveParsedTraces(traces);
		file.saveFrames(traces);
		// file.saveResults(traces);
	});
}

traceProcessor();








