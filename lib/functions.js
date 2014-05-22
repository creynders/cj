var _ = require('underscore');

var rasch = function(ability, difficulty) {
  prob = (Math.exp(ability - difficulty)) / (1 + Math.exp(ability - difficulty));
  return prob;
}

var estimateJudges = function(players, decisions, judges, callback) {
  markerInfit(players, decisions, judges, [] , callback);
}

var average = function(a) {
  var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
  for(var m, s = 0, l = t; l--; s += a[l]);
  for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
  return r.deviation = Math.sqrt(r.variance = s / t), r;
}

var estimateReliability = function(players) {
  if(players.length>1){
    //get the true score error 
    var tse = _.map(players, function(num, key){ return num.seTrueScore; });
    var rms = _.reduce(tse, function(memo, num) { return memo + Math.pow(num, 2); },0);
    var rmse = Math.pow((rms / tse.length),0.5)
    var tss = _.map(players, function(num, key){ return num.trueScore; });
    var G = average(tss).deviation / rmse;
    var alpha = (Math.pow(G,2) - 1) / Math.pow(G,2);
  }
  else {
	  var alpha = 0;
  }
  return alpha;
}

var markerInfit = function(players, decisions, judges, updateHolder, callback) {
  if (judges.length===0) {
	  //functional style, loop until array is empty
	  callback(updateHolder);
  }
  else {
    var judge = judges.shift();
    //get just my judgements
    var id = judge._id;
    judge.decisions = _.filter(decisions, function(num) {return num.judge == id;});
    judge.comparisons = judge.decisions.length;
    if (judge.comparisons > 0) {
        myJs = judge.decisions;
        //get tptal judging time
        //judge.timeTaken = _.reduce(myJs, function(memo, num){return memo+num.timeTaken},0);
        //calculate the probabilities of getting judgement right
        var probs = _.map(myJs, function(num, key){ return rasch(_.find(players, function(pl) {return pl._id == num.chosen;}).trueScore,_.find(players, function(pl) {return pl._id == num.notChosen; }).trueScore); });
        var numer = _.reduce(probs, function(memo, num) {return memo + resInfo(num);},0);
        var denom = _.reduce(probs, function(memo,num) {return memo + (num * (1-num));},0);
        var wms = numer / denom;
        judge.trueScore = wms;
    }
    else {
        judge.timeTaken = 0;
        judge.trueScore = 0;
        judge.decisions = [];
    }
    updateHolder.push(judge);
    markerInfit(players, decisions, judges, updateHolder, callback);
  }
}

var resInfo = function(p) {
  var res = 1-p;
  var sq = Math.pow(res, 2);
  var info = p * (1 - p);
  var zsq = sq / info;
  var num = info * zsq;
  return num;
}

var estimateCJ = function(task, decisions, players, controller) {
  var iters = 5;
  //starting an iteration
  //reset all values
  for(var i=0; i < players.length; i++){
	  players[i].trueScore = 0;
	  players[i].seTrueScore = 0;
  }
  takeAPass(task, players, decisions, function(){}, iters, controller);
}

var takeAPass = function(task, players, decisions, callback, iters, controller) {
  iters--;
  if (iters<0){
	  controller(task, players);
  } 
  else {
	  cjEstimation(task, players.slice(0), players, decisions, [], takeAPass, iters, controller);	
  }
}

var cjEstimation = function(task, playerids, players , decisions, updateHolder, callback, iters, controller) {
  if (playerids.length===0){
	  //using a functional style, loop until array is empty
	  callback(task, updateHolder, decisions, callback, iters, controller);
  } 
  else {
	  var plyr = playerids.shift();
	  //check for decisions
	  if (plyr.comparisons > 0) {
	    var id = plyr.id;
	    //get decisions for this player
 	    var myDec = plyr.decisions;
	    var myTrueScore = plyr.trueScore;
	    var myObs = plyr.observedScore;
	    //Get list opponents
	    var opps = _.map(myDec, function(id) {
        return _.find(players,function(pl) {
          return(pl._id == id);
        });
      });
	    //Estimate true score
	    var myExp = _.reduce(opps, function(memo, num) {
		    return memo+rasch(myTrueScore,num.trueScore)
	    },0);
	    //Calculate info
	    var info = _.reduce(opps, function(memo, num) {
		    return memo + rasch(myTrueScore,num.trueScore) * (1-(rasch(myTrueScore,num.trueScore)))
	    },0);
	    var update = myTrueScore + ((myObs - myExp)/info);
	    //Update players
	    var seTrueScore = 1/Math.sqrt(info);
	    if(iters>0) {
		    plyr.trueScore = update;
	    }
	    plyr.seTrueScore = seTrueScore;
	    updateHolder.push(plyr);
	  } 
    else {
	    updateHolder.push(plyr);
	  }
	  cjEstimation(task, playerids, players, decisions, updateHolder, callback, iters, controller);
  }
}

module.exports = {
    rasch: rasch,
    estimateJudges : estimateJudges,
    average: average,
    estimateReliability : estimateReliability,
    markerInfit : markerInfit,
    resInfo: resInfo,
    estimateCJ: estimateCJ,
    takeAPass: takeAPass,
    cjEstimation: cjEstimation
};