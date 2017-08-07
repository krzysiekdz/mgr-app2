var names = require('./names/names');
var cats = names.benchmarks.categories;
var frms = names.frameworks;
var file = require('./file');

var errs = [];
var frameCount = 4;

exports.parse = parse;
function parse(traces) {
	var parser = new TraceParser(traces);
	parser.parse();
	file.saveParseErrors(errs); //checking if results are as expected
	console.log('parse-frame error count:', errs.length);
}


function TraceParser(traces) {
	this.traces = traces;
}


TraceParser.prototype.parse = function() {
	for(var i = 0; i < this.traces.length; i++) {
		var trace = this.traces[i];

		if(trace.memory) { //memory traces
			if(trace.benchmark.indexOf('load') > -1) { //benchmark: memory_load
				trace.logs = this.filterLogs_Memory(trace.logs, isParseHtmlEnd, '', trace);
				trace.frames = this.toFrames_Memory(trace.logs);
			} else {//benchmarks: memory_add
				trace.logs = this.filterLogs_Memory(trace.logs, isEventDispatch, 'click', trace);
				trace.frames = this.toFrames_Memory(trace.logs);
			}
			
		} 
		// else if (trace.load) {//load traces
		// 	//do nothing, i read this results manually
		// }
		else { //rest: cpu traces
			
			if(isCategory(cats.input, trace.benchmark) || isCategory(cats.edit, trace.benchmark) || 
				isCategory(cats.search, trace.benchmark) ) {//input, edit, search
				trace.logs = this.filterLogs(trace.logs, isEventDispatch, 'keypress', trace);
				trace.frames = this.toFrames(trace.logs, isEventDispatch, 'keypress');
			} 
			else if (isCategory(cats.fetch, trace.benchmark)) {//fetch traces

				if(frms.isFramework(trace.framework, 
						frms.vanilla_nonk, 
						frms.vanilla_keyed,
						frms.react_keyed,
						frms.react_nonk)) {//vanillajs, reactjs
					trace.logs = this.filterLogs(trace.logs, isXHRReadyStateChange, '', trace);
					trace.frames = this.toFrames(trace.logs, isXHRReadyStateChange);
				} 
				else if(frms.isFramework(trace.framework, 
							frms.angular1_nonk,
							frms.angular1_keyed, 
							frms.angular2_keyed,
							frms.angular2_nonk)) {//angular1, angular2
					trace.logs = this.filterLogs(trace.logs, isXHRLoad, '', trace);
					trace.frames = this.toFrames(trace.logs, isXHRLoad);	
				} 
				
			} 
			else { //rest of benchmarks: add, clear, update, replace, swap, remove, filter, select
				trace.logs = this.filterLogs(trace.logs, isEventDispatch, 'click', trace);
				trace.frames = this.toFrames(trace.logs, isEventDispatch, 'click');
			}
		}
	}
}

//filtering logs to get only necessary logs; frames consist of this filtered logs
TraceParser.prototype.filterLogs = function(logs, isFirstElemOfFrame, name, trace) {
	this.parsedLogs = [];
	this.i = 0;
	var filteredFrames = 0;//for error checking; should be frameCount frames

	try {
		for( ; this.i < logs.length; this.i++) {
			var log = logs[this.i];

			if(isFirstElemOfFrame(log, name)) {
				this.filterFrame(logs, isFirstElemOfFrame, name);
				filteredFrames++;
			}
		}

		if(filteredFrames < frameCount) {
			throw 'Exception while parsing cpu frame: to small number of frames!';
		}

	} catch(e) {
		errs.push({
			framework: trace.framework,
			benchmark: trace.benchmark,
			exception: e,
		});
		// return [];
	}

	return this.parsedLogs;
}

 function isEventDispatch(log, evt_name) {
	if(log.name === 'EventDispatch' && log.args.data.type === evt_name) {
		return true;
	}
	return false;
}

 function isXHRReadyStateChange(log) {
	if(log.name === 'XHRReadyStateChange' && log.args.data.readyState === 4) {
		return true;
	}
	return false;
}

 function isXHRLoad(log) {
	if(log.name === 'XHRLoad') {
		return true;
	}
	return false;
}

 function isParseHtmlEnd(log) {
	if(log.name === 'ParseHTML' && log.ph === 'E') {
		return true;
	}
	return false;
}

function isHitTest(log) {
	if(log.name === 'HitTest') {
		return true;
	}
	return false;
}


function isCategory(category, bench_name) {
	if(bench_name.indexOf(category.name) === 0) {
		return true;
	}
	return false;
}


TraceParser.prototype.filterFrame = function(logs, isFirstElemOfFrame, name) {
	var cache = []; //if frame is crashed we do not add it
	cache.push(logs[this.i]); //get EventDispatch or XHR (in general, firstElementOfFrame)
	var threshold = logs[this.i].ts + logs[this.i].dur; //filter is cutting of every other frames before this threshold (that is during runnig java script - we dont wont them) - only GC logs can pass through
	this.i++;
	// var hit = false;

	while((this.i < logs.length) && (logs[this.i].name !== 'Paint')) {//get every log until it is Paint log; if it is another EventDispatch log, reject it
		var log = logs[this.i];
		// if(isHitTest(log) && !hit) {
		// 	console.log('hittest');
		// 	hit = true;
		// }
		if( /*!isFirstElemOfFrame(log, name) && */ (log.ts >= threshold || log.name === 'MinorGC' ))
			cache.push(logs[this.i]);
		this.i++;
	}
	var paints = 0;
	while((this.i < logs.length) && (logs[this.i].name === 'Paint')) {//get every Paint log
		cache.push(logs[this.i]);
		this.i++;
		paints++;
	}
	// if(hit) {
	// 	throw 'hit test';
	// }
	if(paints === 0) {
		throw "Exception while parsing cpu frame: no paints!";
	}
	this.i--; //set counter 1 step back

	if(paints === 0) {
		return false; //frame crashed
	} else {
		this.parsedLogs = this.parsedLogs.concat(cache);
		return true; //frame
	}
}


//------------------------

//adaptFrames - special function which sets up specific frame params (for example reduces event=event-layout for specific cases)
TraceParser.prototype.toFrames = function(parsedLogs, isFirstElemOfFrame, name, adaptFrames) { 
	var frames = [];
	var fno = 0;
	var i = 0;

	for( ; i < parsedLogs.length; i++) {
		var log = parsedLogs[i];

		if(isFirstElemOfFrame(log, name)) {//dur
			frames.push({
				frameNo: ++fno,
				event: log.dur / 1000,
				start: log.ts,
				recalc: [], //recalc and layout need some more work
				layout: [],
				update: 0,
				paint: [],
				gc: [],
			});
		} else if(isGC(log)) {//ph
			frames[fno-1].gc.push(log);
		} else if(isRecalc(log)) {//ph
			frames[fno-1].recalc.push(log);
		} else if(isLayout(log)) {//ph
			frames[fno-1].layout.push(log);
		} else if(isUpdateLayer(log)) {//dur
			frames[fno-1].update += log.dur/1000;
		} else if(isPaint(log)) {//dur
			// frames[fno-1].paint += log.dur;
			frames[fno-1].paint.push(log);//for last ts and dur to count frame length 
		}
	}

	this.calculateFrames(frames);
	if(adaptFrames && typeof adaptFrames == 'function') {
		adaptFrames(frames);
	}
	this.finalizeFrames(frames);

	return frames;
}


function isRecalc(log) {
	return log.name === 'UpdateLayoutTree' ? true : false;
}

function isLayout(log) {
	return log.name === 'Layout' ? true : false;
}

function isUpdateLayer(log) {
	return log.name === 'UpdateLayerTree' ? true : false;
}

function isPaint(log) {
	return log.name === 'Paint' ? true : false;
}

function isGC(log) {
	return (log.name === 'MinorGC') ? true : false;
}


TraceParser.prototype.calculateFrames = function(frames) {
	for(var i = 0; i < frames.length; i++) {
		var frame = frames[i];
		frame.gc = reduce(frame.gc) / 1000;
		frame.recalc = reduce(frame.recalc) / 1000;
		frame.layout = reduce(frame.layout) / 1000;
		frame.paint = reducePaints(frame) / 1000;
	}
}

function reduce(arr) {
	var first = true;
	var b,e, sum = 0;

	for(var i = 0; i < arr.length; i++) {
		var el = arr[i];
		if(el.ph === 'B' && first) {
			first = false;
			b = el.ts;
		} else if(el.ph === 'E') {
			while((i+1) < arr.length && arr[i+1].ph === 'E') {
				i++;
			}
			e = arr[i].ts;
			sum += (e-b);
			first = true;
		}
	}

	return sum;
}

function reducePaints(frame) {
	var sum = 0, paints = frame.paint, i = 0
	for(; i < paints.length; i++) {
		sum += paints[i].dur;
	}
	frame.end = paints[i-1].ts;
	frame.end_dur = paints[i-1].dur;
	return sum;
}

TraceParser.prototype.finalizeFrames = function(frames) {
	for(var i = 0; i < frames.length; i++) {
		var frame = frames[i];

		frame.length = (frame.end - frame.start + frame.end_dur) / 1000;
		frame.sum = frame.event + frame.recalc + frame.layout + frame.update + frame.paint;

		if(frame.sum > frame.length) {
			throw "wrong frame length; sum = " + frame.sum + ", length = " + frame.length;
		}
		delete frame.start;
		delete frame.end;
		delete frame.end_dur;
	}	
}

//adapters now are not used
function adapterEvent_Layout(frames) {
	for(var i = 0; i < frames.length; i++) {
		var frame = frames[i];
		frame.event -= frame.layout;
	}
}

//--------------------------------------------------
//memory parsing implementation

TraceParser.prototype.filterLogs_Memory = function(logs, isFirstElemOfFrame, name, trace) {
	this.parsedLogs = [];
	this.i = 0;
	var filteredFrames = 0;

	var mem_load = (isFirstElemOfFrame === isParseHtmlEnd) ? true : false;

	try {
		for( ; this.i < logs.length; this.i++) {
			var log = logs[this.i];

			if(isFirstElemOfFrame(log, name)) {
				if(mem_load) {
					this.i++; //skiping first element of frame
					this.getMemoryLogs(logs, isFirstElemOfFrame, name);
				} else {
					this.skipFrame(logs);
					this.getMemoryLogs(logs, isFirstElemOfFrame, name);
				}
				
				filteredFrames++;
			}
		}

		if(filteredFrames < frameCount) {
			throw "Exception while parsing memory frame: wrong number of frames!";
		}
	} catch(e) {
		errs.push({
			framework: trace.framework,
			benchmark: trace.benchmark,
			exception: e,
		});
		return [];
	}
	return this.parsedLogs;
}

TraceParser.prototype.skipFrame = function(logs) {
	this.i++;

	while((this.i < logs.length) && (logs[this.i].name !== 'Paint')) {//get every log until it is Paint log; 
		this.i++;
	}
	var paints = 0;
	while((this.i < logs.length) && (logs[this.i].name === 'Paint')) {//get every Paint log
		this.i++;
		paints++;
	}
	if(paints === 0) {
		throw "Exception while parsing memory frame: no paints while skipping memory_add_X frame";
	}
}

TraceParser.prototype.getMemoryLogs = function(logs, isFirstElemOfFrame, name) {	
	var gcCount = 0;
	while((this.i < logs.length) && !isFirstElemOfFrame(logs[this.i], name) ) {//get every log until it is: event click or parse html
		if(isMajorGC(logs[this.i])) {
			this.parsedLogs.push(logs[this.i]);
			gcCount++;
		}
		this.i++;
	}

	this.parsedLogs.push({name: 'memory_frame_end'});

	if(gcCount === 0) {
		throw "Exception while parsing memory frame: no majorGC info!";
	}

	if(this.i !== logs.length) //if it is not last log
		this.i--;
}

function isMajorGC(log) {
	return (log.name === 'MajorGC') ? true : false;
}

TraceParser.prototype.toFrames_Memory = function(parsedLogs) { //parsedLogs - logs with MajorGC info
	var frames = [];
	var fno = 0;
	var i = 0;
	var before, after;

	for( ; i < parsedLogs.length; i++) {
		var log = parsedLogs[i];
		fno++;
		frames.push({
			frameNo: fno,
			memory_before: 0,
			memory_after: 0,
		});

		before = [];
		after = [];
		while( (i < parsedLogs.length) && !(isMemoryFrameEnd(log)) ) {
			if(log.args.usedHeapSizeBefore) {
				before.push(log.args.usedHeapSizeBefore) ;
			} else if(log.args.usedHeapSizeAfter) {
				after.push(log.args.usedHeapSizeAfter) ;
			}
			i++;
			log = parsedLogs[i];
		}
		before.sort((a,b) => a < b);
		after.sort((a,b) => a > b);
		frames[fno-1].memory_before = before[0] / 1024 / 1024;
		frames[fno-1].memory_after = after[0] / 1024 / 1024;
	}

	return frames;
}

function isMemoryFrameEnd(log) {
	return (log.name === 'memory_frame_end') ? true : false;
}


