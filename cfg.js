var methods = {
	do_nothing: 0,
	reject_worst: 1,
	save_best: 2,
};

var cfg = {
	METHOD: 2,
	COUNT: 5,  //how many from test samples we will reject/save because they are the worst/best results 
	methods: methods,
};


module.exports = cfg;

