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

	finalize(traces);//but skip 'load' and 'memory' traces
	finalizeMemory(traces);//memory traces
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
	
	// gathering all frames per trace in result object
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
	result.event = prepare(result.event);
	result.gc = prepare(result.gc);
	result.recalc = prepare(result.recalc);
	result.layout = prepare(result.layout);
	result.update= prepare(result.update);
	result.paint = prepare(result.paint);
	result.total = prepare(result.total);
}

function prepare(arr) {
	arr.sort((a,b)=> a-b);
	var count = config.COUNT;
	if(config.METHOD === config.methods.save_best) {
		return arr.slice(0, count);
	} else if (config.METHOD === config.methods.reject_worst) {
		return arr.slice(0, arr.length - count);
	} else if (config.METHOD === config.methods.do_nothing) {
		return arr;
	}
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


function finalize(traces) {
	//1.wyniki pogrupowac w dwie grupy - keyed i non-keyed
	//2.w kazdej z tych grup pogrupowac testy na benchmarki; w kazdej grupie benchmarkow znalesc test dla vanilla-js - do niego bedziemy porownywac; test umiescic na pozycji 0 w tablicy
	//3.kazdy test odniesc do czasow vanillajs (event, recalc, total) tj  framework_time / vanillajs_time i np czasy 1.5 / 1 -> wychodzi 1.5 czyli framework w danej kategorii ma czas o 50% gorszy
	//4.pogrupowac wyniki po frameworku
	//5.podsumować każdą kategorię

	var keyedTraces = [], nonkTraces = [];

	//1 
	for(var i = 0; i < traces.length; i++) {
		var trace = traces[i];
		if(trace.memory || trace.load) //omitting memory and load traces
			continue;
		if(trace.keyed) {
			keyedTraces.push(trace);
		} else {
			nonkTraces.push(trace);
		}
	}

	//2. 
	keyedTraces = groupByBenchmarks(keyedTraces);
	nonkTraces = groupByBenchmarks(nonkTraces);

	//3
	normalizeBenchmarks(keyedTraces);
	normalizeBenchmarks(nonkTraces);

	//4
	summary(traces, filter_Overall, null, summaryAlg1);

	//5
	summary(traces, filter_Overall, names.benchmarks.categories.all, summaryAlg1);
}

function groupByBenchmarks(tracesArr) {
	var obj = {};
	for(var i = 0; i < tracesArr.length; i++) {
		var trace = tracesArr[i];

		var b = trace.benchmark;
		if(obj[b] === undefined) {
			obj[b] = [trace];
		} else {
			if(trace.framework.indexOf('vanilla') > -1) {
				obj[b].unshift(trace);
			}
			else {
				obj[b].push(trace);
			}
		}
	}
	return obj;
}

function normalizeBenchmarks(benchsObj) {
	for(var key in benchsObj) {
		var benchs = benchsObj[key];
		var trace = benchs[0];
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


function summary(traces, filterFn, categories, summaryAlgorithm) { 

	var getCategory = (categories) ?  function (trace) {
		for(var i = 0; i < categories.length; i++) {
			if(trace.benchmark.indexOf(categories[i].name) > -1) {
				return categories[i];
			}
		}
		return null;
	} : function(){ return {name: 'overall', sort_index: -1};};

	var groups = {};
	for(var i = 0; i < traces.length; i++) {
		var trace = traces[i];

		if(trace.omit_summary) {
			console.log('omiting: ',trace.benchmark, trace.framework);
			continue;
		}


		if( filterFn(trace) )//omiting some traces
			continue;

		var gname = trace.framework + getCategory(trace).name;
		if(groups[gname] === undefined) {
			groups[gname] = [trace.results];
			groups[gname].framework = trace.framework;
			groups[gname].sort_index = trace.framework_index;
			groups[gname].cat = getCategory(trace);
			groups[gname].keyed = trace.keyed;
		} else {
			groups[gname].push(trace.results);
		}
	}

	for(var gname in groups) {
		summaryAlgorithm(groups, gname, traces);
	}
}

function filter_Overall(trace) {
	if(trace.memory || trace.load || trace.summary)
		return true;
	return false;
}


function createResultObj(groups, gname) {
	return {
		framework: groups[gname].framework,
		framework_index: groups[gname].sort_index,
		keyed: groups[gname].keyed,
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
		category: groups[gname].cat.name,
		category_index: groups[gname].cat.sort_index,
	};
}

function summaryAlg1(groups, gname, traces) {
	//framework summary object is added to traces
	var result = createResultObj(groups, gname);
	traces.push(result);//summary object added to traces

	result = result.results;
	var group = groups[gname];
	var e_ctr = gc_ctr = r_ctr = l_ctr = u_ctr = p_ctr = 0;
	for(var i = 0; i < group.length; i++) {
		//sum only if exists
		if(group[i].event_factor) {
			result.event += group[i].event_factor;
			e_ctr++;
		}
		if(group[i].gc_factor){
			result.gc += group[i].gc_factor;
			gc_ctr++;
		}
		if(group[i].recalc_factor){
			result.recalc += group[i].recalc_factor;
			r_ctr++;
		}
		if(group[i].layout_factor){
			result.layout += group[i].layout_factor;
			l_ctr++;
		}
		if(group[i].update_factor){
			result.update += group[i].update_factor;
			u_ctr++;
		}
		if(group[i].paint_factor){
			result.paint += group[i].paint_factor;
			p_ctr++;
		}

		result.total += group[i].total_factor;
	}

	if(e_ctr)
		result.event = result.event / e_ctr;
	if(gc_ctr)
		result.gc = result.gc / gc_ctr;
	if(r_ctr)
		result.recalc = result.recalc / r_ctr;
	if(l_ctr)
		result.layout = result.layout / l_ctr;
	if(u_ctr)
		result.update = result.update / u_ctr;
	if(p_ctr)
		result.paint = result.paint / p_ctr;

	result.total = result.total / group.length;
}

//-----------------------
//memory results 

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
	result.memory_before = prepare(result.memory_before);
	result.memory_after = prepare(result.memory_after);
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

		if(trace.keyed) {
			keyedTraces.push(trace);
		} else {
			nonkTraces.push(trace);
		}
	}

	keyedTraces = groupByBenchmarks(keyedTraces);
	nonkTraces = groupByBenchmarks(nonkTraces);

	normalizeMemoryBenchmarks(keyedTraces);
	normalizeMemoryBenchmarks(nonkTraces);

	var mem_cat = names.benchmarks.categories.all[12];
	summary(traces, filter_Mem, [mem_cat] , summaryAlg2);
}


function normalizeMemoryBenchmarks(benchsObj) {
	for(var key in benchsObj) {
		var benchs = benchsObj[key];
		var trace = benchs[0];
		var b0 = benchs[0].results;//vanillajs benchmark (keyed or nonkeyed)
		for(var i = 1; i < benchs.length; i++) {
			normalizeMem(benchs[i].results, b0);
		}
		normalizeMem(b0, b0);
	}
}

function normalizeMem(b1, b0) {//b0 - vanillajs benchmark, b1 - some framework benchmark; b1 and b0 are the same test cases (for example both are 'add_1k')
	b1.memb_factor = b1.mema_factor = 0;

	if(b0.memory_before)
		b1.memb_factor = b1.memory_before / b0.memory_before;
	if(b0.memory_after)
		b1.mema_factor = b1.memory_after / b0.memory_after;
}

function filter_Mem(trace) {
	if(trace.memory)
		return false;
	return true;
}


function createResultObj_Mem(groups, gname) {
	return {
		framework: groups[gname].framework,
		framework_index: groups[gname].sort_index,
		keyed: groups[gname].keyed,
		results: {
			before: 0,
			after: 0,
		},
		summary: true,//summary object
		category: groups[gname].cat.name,
		category_index: groups[gname].cat.sort_index,
	};
}

function summaryAlg2(groups, gname, traces) {
	//framework summary object is added to traces
	var result = createResultObj_Mem(groups, gname);
	traces.push(result);//summary object added to traces

	result = result.results;
	var group = groups[gname];
	var a_ctr = b_ctr = 0;
	for(var i = 0; i < group.length; i++) {
		//sum only if exists
		if(group[i].mema_factor) {
			result.after += group[i].mema_factor;
			a_ctr++;
		}
		if(group[i].memb_factor){
			result.before += group[i].memb_factor;
			b_ctr++;
		}
	}

	if(a_ctr)
		result.after = result.after / a_ctr;
	if(b_ctr)
		result.before = result.before / b_ctr;
}


