var _ = require('underscore');
var statutils = require('./statutils');
var rasch = statutils.rasch;
var average = statutils.average;
var resInfo = statutils.resInfo;
var wms = statutils.wms;

var probabilities = function(players, decisions){
    //Look up the true score of each player, and calculate the probabliity of the decision
    var probs = _.map(decisions, function(num, key){
      return (rasch(_.find(players, function(pl) {
        return pl._id == num.chosen;}).trueScore,
              _.find(players, function(pl) {
        return pl._id == num.notChosen;}).trueScore))
    })
    return probs;
};

var playerProbs = function(player, probs, decisions){
    //Return the probabilities for the decisions the script was involved in  
    var pprobs = [];
    for(var i=0; i<decisions.length; i++){
      if(decisions[i].chosen == player._id | decisions[i].notChosen == player._id){
        pprobs.push(probs[i]);
      }
    }
    return pprobs;
};

var getPlayerStats = function(players, probs, decisions){
  // Loop through players
  var infit = [];
  for (var i=0; i<players.length; i++){
    // Get probs
    var pprobs = playerProbs(players[i], probs, decisions);
    // Get wms
    infit.push(wms(pprobs));
  }  
  return infit;
};

var judgeProbs = function(judge, probs ,decisions){
    //Return the probabilities for the decisions the judge was involved in
    var jprobs = [];
    for (var i=0; i < decisions.length; i++){
      if(decisions[i].judge==judge._id){
        jprobs.push(probs[i])
      }  
    }
    return jprobs;
};

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
};

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
};

var estimateCJ = function(task, players, controller) {
    players.forEach(function(player){
        player.trueScore=0;
        player.seTrueScore=0;
    });
    
    for(var i=4; i>=0; i++){
        cjEstimation(players, i);	
    }
    controller(task, players);
};

var cjEstimation = function(players, iters) {
    
    for(var i=0; i<players.length; i++){
        var player = players[i];
        var opponents;
        if(player.comparisons>0){
            opponents = _.filter(players, function(candidate){
                return player.decisions.indexOf(candidate.id)>=0;
            });
            var myExp=0;
            var info=0;
            _.each(opponents, function(opponent){
                var r =rasch(player.trueScore, opponent.trueScore);
                myExp +=r;
                info += r* (1-r);
            });
            if(iters>0){
                player.trueScore += ((player.observedScore-myExp)/info);
            }
            player.seTrueScore = 1/Math.sqrt(info);
        }
    }
};

module.exports = {
    rasch: rasch,
    average: average,
    estimateReliability : estimateReliability,
    resInfo: resInfo,
    estimateCJ: estimateCJ,
    takeAPass: takeAPass,
    cjEstimation: cjEstimation,
    probabilities: probabilities,
    judgeProbs: judgeProbs,
    getJudgeStats: getJudgeStats,
    playerProbs: playerProbs,
    getPlayerStats: getPlayerStats
};