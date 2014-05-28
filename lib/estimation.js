var _ = require('underscore');
var statutils = require('./statutils');
var rasch = statutils.rasch;
var average = statutils.average;
var resInfo = statutils.resInfo;
var wms = statutils.wms;

var estimateJudges = function(players, decisions, judges, callback) {
  markerInfit(players, decisions, judges, [] , callback);
}

var probabilities = function(players, decisions){
    //Look up the true score of each player, and calculate the probabliity of the decision
    var probs = _.map(decisions, function(num, key){
      return (rasch(_.find(players, function(pl) {
        return pl._id == num.chosen;}).trueScore,
              _.find(players, function(pl) {
        return pl._id == num.notChosen;}).trueScore))
    })
    return probs;
}

var judgeProbs = function(judge, probs ,decisions){
    //Return the probabilities for the decisions the judge was involved in
    var jprobs = [];
    for (var i=0; i < decisions.length; i++){
      if(decisions[i].judge==judge._id){
        jprobs.push(probs[i])
      }  
    }
    return jprobs;
}

var getJudgeStats = function(judges, probs, decisions){
  // Loop through judges
  var infit = []
  for (var i=0; i<judges.length; i++){
    // Get probs
    var jprobs = judgeProbs(judges[i], probs, decisions);
    // Get wms
    infit.push(wms(jprobs))
  }  
  return infit;
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
    cjEstimation: cjEstimation,
    probabilities: probabilities,
    judgeProbs: judgeProbs,
    getJudgeStats: getJudgeStats
};