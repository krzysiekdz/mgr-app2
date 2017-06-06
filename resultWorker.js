var config = require('./cfg');
var jstat = require('jstat').jStat;
var names = require('./names/names');

exports.results = results;
function results(traces) {
	for(var i = 0; i < traces.length; i++) {
		var trace = traces[i];
		if(trace.memory) {
			trace.results = procMemory(trace.frames);	
		} else if(trace.load) {
			//do nothing; i read them manually
		}
		else { //cpu test
			trace.results = proc(trace.frames);	
		}
	}

	finalize(traces);//but skip load and memory traces
	finalizeMemory(traces);
}


function proc(frames) {//frames - frames in one trace
	var result = {
		event: [],
		gc: [],
		recalc: [],
		layout: [],
		update: [],
		paint: [],
		total: []
	};
	
	//gathering all frames per trace in result object
	for(var i = 0; i  < frames.length; i++) {
		var frame = frames[i];
		result.event.push(frame.event) ;
		result.gc.push(frame.gc) ;
		result.recalc.push(frame.recalc) ;
		result.layout.push(frame.layout) ;
		result.update.push(frame.update) ;
		result.paint.push(frame.paint) ;
		result.total.push(frame.length) ;
	}

	cut(result);
	stat(result);

	return result;
}


function cut(result) {
	result.event = reject(result.event);
	result.gc = reject(result.gc);
	result.recalc = reject(result.recalc);
	result.layout = reject(result.layout);
	result.update= reject(result.update);
	result.paint = reject(result.paint);
	result.total = reject(result.total);
}

function reject(arr) {
	arr.sort((a,b)=> {return a > b;});
	var to_rej = config.REJECT_COUNT;
	if(to_rej > 0)
		return arr.slice(0, -to_rej);
	return arr;
}

function stat(result) {
	//stdev counting
	result.event_stdev = jstat(result.event).stdev();
	result.gc_stdev = jstat(result.gc).stdev();
	result.recalc_stdev = jstat(result.recalc).stdev();
	result.layout_stdev = jstat(result.layout).stdev();
	result.update_stdev = jstat(result.update).stdev();
	result.paint_stdev = jstat(result.paint).stdev();
	result.total_stdev = jstat(result.total).stdev();

	//mean counting
	result.event = jstat(result.event).mean();
	result.gc = jstat(result.gc).mean();
	result.recalc = jstat(result.recalc).mean();
	result.layout = jstat(result.layout).mean();
	result.update = jstat(result.update).mean();
	result.paint = jstat(result.paint).mean();
	result.total = jstat(result.total).mean();
}


//porównanie wyników z vanilla js
//mozna porównywac tez zestawienia, np opeoracje add, operacje replace itd, oraz wszyskie razem
function finalize(traces) {
	//1.przejrzec wszystkie traces i sprawdzic czy w nazwie framework wystepuje slowo keyed - nadac flage keyed:true|false
	//2.wyniki pogrupowac w dwie grupy - keyed i non-keyed
	//3.w kazdej z tych grup pogrupowac testy na benchmarki; w kazdej grupie benchmarkow znalesc test dla vanilla-js - do niego bedziemy porownywac; test umiescic na pozycji 0 w tablicy
	//4.kazdy test odniesc do czasow vanillajs (tj event, recalc, total) tj  framework_time / vanillajs_time i np czasy 1.5 / 1 -> wychodzi 1.5 czyli framework w danej kategorii ma czas o 50% gorszy
	//5.w results maja byc 2 czasy - np event oraz event2 (ten odnoszacy sie do vanillajs), moze tez byc odchylenie standardowe, czyi np : event, event_factor, event_stddev; kolorami mozna potem oznaczyc
	//w zaleznosci od przedzialu w jakim wynik sie znajduje - chodzi o factor, tj np event_factor 1 do 1.2 zielony, 1.2 - 1.4 ziel-zółty itd

	//7.zrobic tez osatteczny wynik czyli pogrupowac wyniki po frameworku, dodac wszystkie factory i policzyc srednia (np tylko total_factor albo mozna policzyc taka srednia dla kazdego factora osobno 
	//oraz jedną calosciową)
	//8.jako results dorzucic obiekty podsumowujace kazdy framework; aplikacja prezentująca wtedy ma tylko prezentowac nie musi nic juz doliczac

	var keyedTraces = [], nonkTraces = [];

	for(var i = 0; i < traces.length; i++) {
		var trace = traces[i];
		//1 && 2
		if(trace.framework.indexOf('keyed') > -1) {
			trace.keyed = true;
			keyedTraces.push(trace);
		} else {
			trace.keyed = false;
			nonkTraces.push(trace);
		}
	}

	//3.
	keyedTraces = groupByBenchmarks(keyedTraces);
	nonkTraces = groupByBenchmarks(nonkTraces);

	//4 && 5
	normalizeBenchmarks(keyedTraces);
	normalizeBenchmarks(nonkTraces);

	//7 && 8
	frameworkSummaryAll(traces);

	//sumup categories
	frameworkSummaryCat(traces, names.benchmarks.categories.all);
}

function groupByBenchmarks(tracesArr) {
	var obj = {};
	for(var i = 0; i < tracesArr.length; i++) {
		var trace = tracesArr[i];

		var b = trace.benchmark;
		if(obj[b] === undefined) {
			obj[b] = [trace];
		} else {
			if(b.indexOf('vanilla') > -1)
				obj[b].unshift(trace);
			else 	
				obj[b].push(trace);
		}
	}
	return obj;
}

function normalizeBenchmarks(benchsObj) {
	for(var key in benchsObj) {
		var benchs = benchsObj[key];
		var trace = benchs[0];
		if(trace.memory || trace.load) //omitting memory and load traces
			continue;
		var b0 = benchs[0].results;//vanillajs benchmark (keyed or nonkeyed)
		for(var i = 1; i < benchs.length; i++) {
			normalize(benchs[i].results, b0);
		}
		normalize(b0, b0);
	}
}

function normalize(b1, b0) {//b0 - vanillajs benchmark, b1 - some framework benchmark; b1 and b0 are the same test cases (for example both are 'add_1k')
	b1.event_factor = b1.gc_factor = b1.recalc_factor = b1.layout_factor = b1.update_factor = 0;

	if(b0.event)
		b1.event_factor = b1.event / b0.event;
	if(b0.gc)
		b1.gc_factor = b1.gc / b0.gc;
	if(b0.recalc)
		b1.recalc_factor = b1.recalc / b0.recalc;
	if(b0.layout)
		b1.layout_factor = b1.layout / b0.layout;
	if(b0.update)
		b1.update_factor = b1.update / b0.update;
	if(b0.paint)
		b1.paint_factor = b1.paint / b0.paint;

	b1.total_factor = b1.total / b0.total;
}

//summary for all benchmarks results per framework
function frameworkSummaryAll(traces) {
	var frms = {};
	for(var i = 0; i < traces.length; i++) {
		var trace = traces[i];

		if(trace.memory || trace.load) //omitting memory and load traces
			continue;

		var frm = trace.framework;
		if(frms[frm] === undefined) {
			frms[frm] = [trace.results];
			frms[frm].sort_index = trace.framework_index;
		} else {
			frms[frm].push(trace.results);
		}
	}

	for(var frm in frms) {

		//framework summary object is added to traces
		var frmRes = {
			framework: frm,
			framework_index: frms[frm].sort_index,
			results: {
				event: 0,
				gc:0,
				recalc: 0,
				layout: 0,
				update: 0,
				paint: 0,
				total: 0,
			},
			summary: true,//summary object
			category: "all",
			category_index: -100,
		};
		traces.push(frmRes);//summary object added to traces

		frmRes = frmRes.results;
		frm = frms[frm];
		var e_ctr = gc_ctr = r_ctr = l_ctr = u_ctr = p_ctr = 0;
		for(var i = 0; i < frm.length; i++) {
			//sum only if exists
			if(frm[i].event_factor) {
				frmRes.event += frm[i].event_factor;
				e_ctr++;
			}
			if(frm[i].gc_factor){
				frmRes.gc += frm[i].gc_factor;
				gc_ctr++;
			}
			if(frm[i].recalc_factor){
				frmRes.recalc += frm[i].recalc_factor;
				r_ctr++;
			}
			if(frm[i].layout_factor){
				frmRes.layout += frm[i].layout_factor;
				l_ctr++;
			}
			if(frm[i].update_factor){
				frmRes.update += frm[i].update_factor;
				u_ctr++;
			}
			if(frm[i].paint_factor){
				frmRes.paint += frm[i].paint_factor;
				p_ctr++;
			}

			frmRes.total += frm[i].total_factor;
		}

		if(e_ctr)
			frmRes.event = frmRes.event / e_ctr;
		if(gc_ctr)
			frmRes.gc = frmRes.gc / gc_ctr;
		if(r_ctr)
			frmRes.recalc = frmRes.recalc / r_ctr;
		if(l_ctr)
			frmRes.layout = frmRes.layout / l_ctr;
		if(u_ctr)
			frmRes.update = frmRes.update / u_ctr;
		if(p_ctr)
			frmRes.paint = frmRes.paint / p_ctr;

		frmRes.total = frmRes.total / frm.length;
	}
}

//summaries for every benchmark category per framework
function frameworkSummaryCat(traces, categories) {

	function getCategory(trace) {
		for(var i = 0; i < categories.length; i++) {
			if(trace.benchmark.indexOf(categories[i].name) > -1) {
				return categories[i];
			}
		}
		return null;
	}

	var frms = {};
	for(var i = 0; i < traces.length; i++) {
		var trace = traces[i];

		if(trace.summary)//omiting summaries - they are existing becaue we have called frameworkSummaryAll()
			continue;

		if(trace.memory || trace.load) //omitting memory and load traces
			continue;

		var frm = trace.framework + getCategory(trace).name;
		if(frms[frm] === undefined) {
			frms[frm] = [trace.results];
			frms[frm].framework = trace.framework;
			frms[frm].sort_index = trace.framework_index;
			frms[frm].cat = getCategory(trace);
		} else {
			frms[frm].push(trace.results);
		}
	}

	for(var frm in frms) {

		//summary object for category per framework
		var frmRes = {
			framework: frms[frm].framework,
			framework_index: frms[frm].sort_index,
			results: {
				event: 0,
				gc: 0,
				recalc: 0,
				layout: 0,
				update: 0,
				paint: 0,
				total: 0,
			},
			summary: true,//summary object
			category: frms[frm].cat.name,
			category_index: frms[frm].cat.sort_index,
		};
		traces.push(frmRes);//summary object added to traces

		frmRes = frmRes.results;
		frm = frms[frm];
		var e_ctr = gc_ctr = r_ctr = l_ctr = u_ctr = p_ctr = 0;
		for(var i = 0; i < frm.length; i++) {
			//sum only if exists
			if(frm[i].event_factor) {
				frmRes.event += frm[i].event_factor;
				e_ctr++;
			}
			if(frm[i].gc_factor){
				frmRes.gc += frm[i].gc_factor;
				gc_ctr++;
			}
			if(frm[i].recalc_factor){
				frmRes.recalc += frm[i].recalc_factor;
				r_ctr++;
			}
			if(frm[i].layout_factor){
				frmRes.layout += frm[i].layout_factor;
				l_ctr++;
			}
			if(frm[i].update_factor){
				frmRes.update += frm[i].update_factor;
				u_ctr++;
			}
			if(frm[i].paint_factor){
				frmRes.paint += frm[i].paint_factor;
				p_ctr++;
			}

			frmRes.total += frm[i].total_factor;
		}

		if(e_ctr)
			frmRes.event = frmRes.event / e_ctr;
		if(gc_ctr)
			frmRes.gc = frmRes.gc / gc_ctr;
		if(r_ctr)
			frmRes.recalc = frmRes.recalc / r_ctr;
		if(l_ctr)
			frmRes.layout = frmRes.layout / l_ctr;
		if(u_ctr)
			frmRes.update = frmRes.update / u_ctr;
		if(p_ctr)
			frmRes.paint = frmRes.paint / p_ctr;

		frmRes.total = frmRes.total / frm.length;
	}
}


//-----------------------
//memory results working...

function procMemory(frames) {//frames - frames in one trace
	var result = {
		memory_before: [],
		memory_after: [],
	};
	
	//gathering all frames per trace in result object
	for(var i = 0; i  < frames.length; i++) {
		var frame = frames[i];
		result.memory_before.push(frame.memory_before) ;
		result.memory_after.push(frame.memory_after) ;
	}

	cut_m(result);
	stat_m(result);

	return result;
}


function cut_m(result) {
	result.memory_before = reject(result.memory_before);
	result.memory_after = reject(result.memory_after);
}

function stat_m(result) {
	//stdev counting
	result.memory_before_stdev = jstat(result.memory_before).stdev();
	result.memory_after_stdev = jstat(result.memory_after).stdev();

	//mean counting
	result.memory_before = jstat(result.memory_before).mean();
	result.memory_after = jstat(result.memory_after).mean();
}

//counting factor (framework memory / vanillajs memory) for each benchmark and overall factor per framework in memory results (which is aritmetic mean of factors)
function finalizeMemory(traces) {
	var keyedTraces = [], nonkTraces = [];

	for(var i = 0; i < traces.length; i++) {
		var trace = traces[i];
		if(!trace.memory) //only memory traces
			continue;

		if(trace.framework.indexOf('keyed') > -1) {
			trace.keyed = true;
			keyedTraces.push(trace);
		} else {
			trace.keyed = false;
			nonkTraces.push(trace);
		}
	}

	keyedTraces = groupByBenchmarks(keyedTraces);
	nonkTraces = groupByBenchmarks(nonkTraces);

	normalizeMemoryBenchmarks(keyedTraces);
	normalizeMemoryBenchmarks(nonkTraces);

	//7 && 8
	frameworkSummaryAll(traces);

	//sumup categories
	frameworkSummaryCat(traces, names.benchmarks.categories.all);
}


function normalizeMemoryBenchmarks(benchsObj) {
	for(var key in benchsObj) {
		var benchs = benchsObj[key];
		var trace = benchs[0];
		if(trace.memory || trace.load) //omitting memory and load traces
			continue;
		var b0 = benchs[0].results;//vanillajs benchmark (keyed or nonkeyed)
		for(var i = 1; i < benchs.length; i++) {
			normalize(benchs[i].results, b0);
		}
		normalize(b0, b0);
	}
}

function normalize(b1, b0) {//b0 - vanillajs benchmark, b1 - some framework benchmark; b1 and b0 are the same test cases (for example both are 'add_1k')
	b1.event_factor = b1.gc_factor = b1.recalc_factor = b1.layout_factor = b1.update_factor = 0;

	if(b0.event)
		b1.event_factor = b1.event / b0.event;
	if(b0.gc)
		b1.gc_factor = b1.gc / b0.gc;
	if(b0.recalc)
		b1.recalc_factor = b1.recalc / b0.recalc;
	if(b0.layout)
		b1.layout_factor = b1.layout / b0.layout;
	if(b0.update)
		b1.update_factor = b1.update / b0.update;
	if(b0.paint)
		b1.paint_factor = b1.paint / b0.paint;

	b1.total_factor = b1.total / b0.total;
}

//summary for all benchmarks results per framework
function frameworkSummaryAll(traces) {
	var frms = {};
	for(var i = 0; i < traces.length; i++) {
		var trace = traces[i];

		if(trace.memory || trace.load) //omitting memory and load traces
			continue;

		var frm = trace.framework;
		if(frms[frm] === undefined) {
			frms[frm] = [trace.results];
			frms[frm].sort_index = trace.framework_index;
		} else {
			frms[frm].push(trace.results);
		}
	}

	for(var frm in frms) {

		//framework summary object is added to traces
		var frmRes = {
			framework: frm,
			framework_index: frms[frm].sort_index,
			results: {
				event: 0,
				gc:0,
				recalc: 0,
				layout: 0,
				update: 0,
				paint: 0,
				total: 0,
			},
			summary: true,//summary object
			category: "all",
			category_index: -100,
		};
		traces.push(frmRes);//summary object added to traces

		frmRes = frmRes.results;
		frm = frms[frm];
		var e_ctr = gc_ctr = r_ctr = l_ctr = u_ctr = p_ctr = 0;
		for(var i = 0; i < frm.length; i++) {
			//sum only if exists
			if(frm[i].event_factor) {
				frmRes.event += frm[i].event_factor;
				e_ctr++;
			}
			if(frm[i].gc_factor){
				frmRes.gc += frm[i].gc_factor;
				gc_ctr++;
			}
			if(frm[i].recalc_factor){
				frmRes.recalc += frm[i].recalc_factor;
				r_ctr++;
			}
			if(frm[i].layout_factor){
				frmRes.layout += frm[i].layout_factor;
				l_ctr++;
			}
			if(frm[i].update_factor){
				frmRes.update += frm[i].update_factor;
				u_ctr++;
			}
			if(frm[i].paint_factor){
				frmRes.paint += frm[i].paint_factor;
				p_ctr++;
			}

			frmRes.total += frm[i].total_factor;
		}

		if(e_ctr)
			frmRes.event = frmRes.event / e_ctr;
		if(gc_ctr)
			frmRes.gc = frmRes.gc / gc_ctr;
		if(r_ctr)
			frmRes.recalc = frmRes.recalc / r_ctr;
		if(l_ctr)
			frmRes.layout = frmRes.layout / l_ctr;
		if(u_ctr)
			frmRes.update = frmRes.update / u_ctr;
		if(p_ctr)
			frmRes.paint = frmRes.paint / p_ctr;

		frmRes.total = frmRes.total / frm.length;
	}
}
