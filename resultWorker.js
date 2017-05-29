var config = require('./cfg');
var jstat = require('jstat').jStat;
var names = require('./names');

exports.results = results;
function results(traces) {
	for(var i = 0; i < traces.length; i++) {
		var trace = traces[i];
		if(trace.benchmark.indexOf('mem-') > -1) {
			//memory test
		} else { //cpu test
			trace.results = proc(trace.frames);	
		}
	}

	finalize(traces);
}


function proc(frames) {
	var result = {
		event: [],
		recalc: [],
		layout: [],
		update: [],
		paint: [],
		total: []
	};
	
	for(var i = 0; i  < frames.length; i++) {
		var frame = frames[i];
		result.event.push(frame.event) ;
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
	result.recalc_stdev = jstat(result.recalc).stdev();
	result.layout_stdev = jstat(result.layout).stdev();
	result.update_stdev = jstat(result.update).stdev();
	result.paint_stdev = jstat(result.paint).stdev();
	result.total_stdev = jstat(result.total).stdev();

	//mean counting
	result.event = jstat(result.event).mean();
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
		var b0 = benchs[0].results;//vanillajs benchmark (keyed or nonkeyed)
		for(var i = 1; i < benchs.length; i++) {
			normalize(benchs[i].results, b0);
		}
		normalize(b0, b0);
	}
}

function normalize(b1, b0) {//b0 - vanillajs benchmark, b1 - some framework benchmark; b1 and b0 are the same test cases (for example both are 'add_1k')
	b1.event_factor = b1.event / b0.event;
	b1.recalc_factor = b1.recalc / b0.recalc;
	b1.layout_factor = b1.layout / b0.layout;
	b1.update_factor = b1.update / b0.update;
	b1.paint_factor = b1.paint / b0.paint;
	b1.total_factor = b1.total / b0.total;
}

function frameworkSummaryAll(traces) {
	var frms = {};
	for(var i = 0; i < traces.length; i++) {
		var trace = traces[i];
		var frm = trace.framework;
		if(frms[frm] === undefined) {
			frms[frm] = [trace.results];
			frms[frm].sort_index = trace.framework_index;
		} else {
			frms[frm].push(trace.results);
		}
	}

	for(var frm in frms) {

		var frmRes = {
			framework: frm,
			framework_index: frms[frm].sort_index,
			results: {
				event: 0,
				recalc: 0,
				layout: 0,
				update: 0,
				paint: 0,
				total: 0,
			},
			summary: true,//summary object
			category: "all",
		};
		traces.push(frmRes);//summary object added to traces

		frmRes = frmRes.results;
		frm = frms[frm];
		for(var i = 0; i < frm.length; i++) {
			frmRes.event += frm[i].event_factor;
			frmRes.recalc += frm[i].recalc_factor;
			frmRes.layout += frm[i].layout_factor;
			frmRes.update += frm[i].update_factor;
			frmRes.paint += frm[i].paint_factor;
			frmRes.total += frm[i].total_factor;
		}

		frmRes.event = frmRes.event / frm.length;
		frmRes.recalc = frmRes.recalc / frm.length;
		frmRes.layout = frmRes.layout / frm.length;
		frmRes.update = frmRes.update / frm.length;
		frmRes.paint = frmRes.paint / frm.length;
		frmRes.total = frmRes.total / frm.length;
	}
}

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

		if(trace.summary)//omiting summaries
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

		var frmRes = {
			framework: frms[frm].framework,
			framework_index: frms[frm].sort_index,
			results: {
				event: 0,
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
		for(var i = 0; i < frm.length; i++) {
			frmRes.event += frm[i].event_factor;
			frmRes.recalc += frm[i].recalc_factor;
			frmRes.layout += frm[i].layout_factor;
			frmRes.update += frm[i].update_factor;
			frmRes.paint += frm[i].paint_factor;
			frmRes.total += frm[i].total_factor;
		}

		frmRes.event = frmRes.event / frm.length;
		frmRes.recalc = frmRes.recalc / frm.length;
		frmRes.layout = frmRes.layout / frm.length;
		frmRes.update = frmRes.update / frm.length;
		frmRes.paint = frmRes.paint / frm.length;
		frmRes.total = frmRes.total / frm.length;
	}
}

// exports.workoutResults = workoutResults;
// function workoutResults(results, bench) {
// 	if(bench.indexOf('mem-') === -1) { //cpu tests
// 		results = results.reduce( (a,v) => a.concat((v.paint.end - v.click.ts) / 1000 ) ,  []);//sample time: paint.end - click.start = sample duration
// 	} else {
// 		results = results.reduce( (a,v) => a.concat((v.mem.size)) ,  []);
// 	}

// 	results.sort((a,b) => a - b);//ascending sort
// 	results.splice(util.config.TEST_COUNT - util.config.REJECT_COUNT);//rejecting the worst results
// 	var stat = jstat(results);
// 	return {
// 		min: stat.min(),
// 		max: stat.max(),
// 		mean: stat.mean(),
// 		geomean: stat.geomean(),
// 		stdev: stat.stdev()
// 	};
// }