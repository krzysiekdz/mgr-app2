var names = require('./names/names');

exports.parse = parse;
function parse(traces) {
	var parser = new TraceParser(traces);
	parser.parse();
}


function TraceParser(traces) {
	this.traces = traces;
}

TraceParser.prototype.parse = function() {
	for(var i = 0; i < this.traces.length; i++) {
		var trace = this.traces[i];
		if(trace.benchmark === '') { //ustalic jakie typy ramek beda parsowane
			//konkretny sposob parsowania
		} else {
			trace.logs = this.parseClickEventFrames(trace.logs);//parsed logs - only necessary frames
			trace.frames = this.toFrames(trace.logs);
		}
	}
}

TraceParser.prototype.parseClickEventFrames = function(logs) {
	this.parsedLogs = [];
	this.i = 0;

	for( ; this.i < logs.length; this.i++) {
		var log = logs[this.i];

		if(this.isEventClick(log)) {
			this.parseClickEventFrame(logs);
		}
			
	}
	return this.parsedLogs;
}

TraceParser.prototype.isEventClick = function(log) {
	if(log.name === 'EventDispatch' && log.args.data.type === 'click') {
		return true;
	}
	return false;
}


TraceParser.prototype.parseClickEventFrame = function(logs) {
	this.parsedLogs.push(logs[this.i]); //get EventDispatch log
	this.i++;

	while( (logs[this.i].name !== 'Paint') && (this.i < logs.length) ) {//get every log until it is Paint log; if it is another EventDispatch log, reject it
		if(logs[this.i].name !== 'EventDispatch')
			this.parsedLogs.push(logs[this.i]);
		this.i++;
	}
	while( (logs[this.i].name === 'Paint') && (this.i < logs.length) ) {//get every Paint log
		this.parsedLogs.push(logs[this.i]);
		this.i++;
	}
	this.i--; //set counter 1 step back
}


//------------------------

TraceParser.prototype.toFrames = function(parsedLogs) {
	var frames = [];
	var fno = 0;
	var i = 0;

	for( ; i < parsedLogs.length; i++) {
		var log = parsedLogs[i];

		if(this.isEvent(log)) {//dur
			frames.push({
				frameNo: ++fno,
				event: log.dur / 1000,
				start: log.ts,
				recalc: [], //recalc and layout need some more work
				layout: [],
				update: 0,
				paint: [],
			});
		} else if(this.isRecalc(log)) {//ph
			frames[fno-1].recalc.push(log);
		} else if(this.isLayout(log)) {//ph
			frames[fno-1].layout.push(log);
		} else if(this.isUpdateLayer(log)) {//dur
			frames[fno-1].update += log.dur/1000;
		} else if(this.isPaint(log)) {//dur
			// frames[fno-1].paint += log.dur;
			frames[fno-1].paint.push(log);//for last ts and dur to count frame length 
		}
	}

	this.calculateFrames(frames);

	return frames;
}

TraceParser.prototype.isEvent = function(log) {
	return log.name === 'EventDispatch' ? true : false;
}

TraceParser.prototype.isRecalc = function(log) {
	return log.name === 'UpdateLayoutTree' ? true : false;
}

TraceParser.prototype.isLayout = function(log) {
	return log.name === 'Layout' ? true : false;
}

TraceParser.prototype.isUpdateLayer = function(log) {
	return log.name === 'UpdateLayerTree' ? true : false;
}

TraceParser.prototype.isPaint = function(log) {
	return log.name === 'Paint' ? true : false;
}

//algorithm for recalc and layout logs is: if there are ph:B and ph:E one after another
TraceParser.prototype.calculateFrames = function(frames) {
	for(var i = 0; i < frames.length; i++) {
		var frame = frames[i];
		frame.recalc = reduce(frame.recalc) / 1000;
		frame.layout = reduce(frame.layout) / 1000;
		frame.paint = reducePaints(frame) / 1000;
		prepareFrame(frame);
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

function prepareFrame(frame) {
	frame.length = (frame.end - frame.start + frame.end_dur) / 1000;
	frame.sum = frame.event + frame.recalc + frame.layout + frame.update + frame.paint;
	// frame.sum /= 1000;
	if(frame.sum > frame.length) {
		throw "wrong frame length; sum = " + frame.sum + ", length = " + frame.length;
	}
	delete frame.start;
	delete frame.end;
	delete frame.end_dur;
}



// function readLogs(driver, frm, bench) {
// 	return driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE).then(logs => {
// 		var click, paint, mem;
		
// 		logs.forEach(log => {
// 			var p = JSON.parse(log.message).message.params;
			
// 			if(m.params.name === 'EventDispatch') {
// 				if(m.params.args.data.type === 'click') {
// 					click = {
// 						type: 'click', 
// 						ts: +m.params.ts, 
// 						dur: +m.params.dur, 
// 						end: +m.params.ts + m.params.dur 
// 					};
// 				}
// 			} else if (m.params.name === 'Paint') {
// 				if(click && m.params.ts > click.end ) {
// 					paint = {
// 						type: 'paint', 
// 						ts: +m.params.ts, 
// 						dur: +m.params.dur, 
// 						end: +m.params.ts + m.params.dur 
// 					}
// 				}
// 			} else if (m.params.name === 'MajorGC' && m.params.args.usedHeapSizeAfter) {
// 				mem = {
// 					type: 'gc', 
// 					ts: +m.params.ts, 
// 					size: Number(m.params.args.usedHeapSizeAfter) / 1024 / 1024
// 				}
// 			}
// 		});
// 		return {
// 			click: click,
// 			paint: paint,
// 			mem: mem,
// 		};
// 	});
// }

