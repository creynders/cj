'use strict';
var _ = require('underscore');

var factorial = function(num)
{
    // If the number is less than 0, reject it.
    if (num < 0) {
        return -1;
    }
    // If the number is 0, its factorial is 1.
    else if (num == 0) {
        return 1;
    }
    // Otherwise, call this recursive procedure again.
    else {
        return (num * factorial(num - 1));
    }
}

var rasch = function(ability, difficulty) {
  var ex =Math.exp(ability - difficulty);
  return ex / (1 + ex);
}

var average = function(a) {
  var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
  for(var m, s = 0, l = t; l--; s += a[l]);
  for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
  return r.deviation = Math.sqrt(r.variance = s / t), r;
}

var info = function(p) {
  return p * (1-p);
}

var zsq = function(p) {
  var res = 1 - p;
  return Math.pow(res, 2)/info(p);
}

var wms = function(probs){
  if(probs.length>0){
    var numer = 0;
    var denom = 0;
    for (var i=0; i<probs.length; i++){
      var inf = info(probs[i]);
      numer += inf * zsq(probs[i]);
      denom += inf;
    }
    return (numer / denom);
  } else {
    return 0;
  }
}

function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;

	if (k > set.length || k <= 0) {
		return [];
	}

	if (k == set.length) {
		return [set];
	}

	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}

	// Assert {1 < k < set.length}

	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		head = set.slice(i, i+1);
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}

var infoPR = function(info, wq){
  // Weighted probabilities of selection
  // console.log(info, wq);
  var iPR = _.map(info, function(ii){return Math.pow(ii,wq)});
  //console.log(iPR);
  var totalInfoPR = _.reduce(iPR, function(memo, num){return memo + num},0);
  //console.log(totalInfoPR);
  var probSelect = _.map(iPR, function(i){return i / totalInfoPR});
  //console.log(probSelect);
  return probSelect;
}

var iI = function(theta, trueScores){
  //Get probabiltities for every item
  var Ps = _.map(trueScores, function(trueScore){return rasch(theta,trueScore)});
  //Convert probabilities into information
  var ii = _.map(Ps, function(p){return(info(p))});
  return ii;
}

var wq = function(itemsAdministered,itemsExpected, AP){
  var rng = _.range(1,itemsAdministered+1);
  var numerator = _.reduce(rng, function(memo, num){ return memo + (Math.pow(num,AP)); }, 0);
  var rng = _.range(1,itemsExpected);
  var denominator = _.reduce(rng, function(memo, num){ return memo + (Math.pow(num,AP)); }, 0);
  var wwq = itemsExpected * numerator/denominator;
  return wwq;
}

var calciPR = function(theta, items, done, thr, AP){
  // Progressive selection probabilities
  var info = iI(theta, items);
  var w = wq(done, thr, AP);
  var iPr = infoPR(info, w);
  return iPr;
}

var sampleVector = function(array, runif){
  //Take a cumulative sum of the vector
  var cumulative = 0;
  var sums = _.map(array,function(num){ 
    cumulative += num;
    return cumulative;
  });
  // Loop through and find when the sum has been exceded
  // Break
  for(var i=0;i<sums.length;i++){
    if(sums[i]>runif){
      break;
    }
  }
  return i;
}

module.exports = {
    sampleVector: sampleVector,
    calciPR: calciPR,
    infoPR: infoPR,
    iI: iI,
    wq : wq,
    factorial : factorial,
    rasch : rasch,
    average : average,
    info : info,
    zsq: zsq,
    wms: wms,
    k_combinations: k_combinations,
};
