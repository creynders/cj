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

module.exports = {
    rasch : rasch,
    average : average,
    resInfo : resInfo,
    info : info,
    zsq: zsq,
    wms: wms
};