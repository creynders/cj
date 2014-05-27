'use strict';

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

var resInfo = function(p) {
  var res = 1-p;
  var sq = Math.pow(res, 2);
  var info = p * (1 - p);
  var zsq = sq / info;
  var num = info * zsq;
  return num;
}

module.exports = {
    rasch : rasch,
    average : average,
    resInfo : resInfo
};