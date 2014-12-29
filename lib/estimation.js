var _ = require('underscore');
var statutils = require('./statutils');
var rasch = statutils.rasch;
var average = statutils.average;
var resInfo = statutils.resInfo;
var wms = statutils.wms;

var probabilities = function (players, decisions) {
  //Look up the true score of each player, and calculate the probabliity of the decision
  var probs = _.map(decisions, function (num, key) {
    return (rasch(_.find(players, function (pl) {
        return pl._id == num.chosen;
      }).trueScore,
      _.find(players, function (pl) {
        return pl._id == num.notChosen;
      }).trueScore));
  });
  return probs;
};

var playerProbs = function (player, probs, decisions) {
  //Return the probabilities for the decisions the script was involved in
  var pprobs = [];
  for (var i = 0; i < decisions.length; i++) {
    if (decisions[i].chosen == player._id | decisions[i].notChosen == player._id) {
      pprobs.push(probs[i]);
    }
  }
  return pprobs;
};

var getPlayerStats = function (players, probs, decisions) {
  // Loop through players
  var infit = [];
  for (var i = 0; i < players.length; i++) {
    // Get probs
    var pprobs = playerProbs(players[i], probs, decisions);
    // Get wms
    infit.push(wms(pprobs));
  }
  return infit;
};

var judgeProbs = function (judge, probs, decisions) {
  //Return the probabilities for the decisions the judge was involved in
  var jprobs = [];
  for (var i = 0; i < decisions.length; i++) {
    if (decisions[i].judge == judge._id) {
      jprobs.push(probs[i]);
    }
  }
  return jprobs;
};

var getJudgeStats = function (judges, probs, decisions) {
  // Loop through judges
  var infit = [];
  for (var i = 0; i < judges.length; i++) {
    // Get probs
    var jprobs = judgeProbs(judges[i], probs, decisions);
    // Get wms
    infit.push(wms(jprobs));
  }
  return infit;
};

var estimateReliability = function (players) {
  var alpha;
  if (players.length > 1) {
    //get the true score error
    var tse = _.map(players, function (num, key) {
      return num.seTrueScore;
    });
    var rms = _.reduce(tse, function (memo, num) {
      return memo + Math.pow(num, 2);
    }, 0);
    var rmse = Math.pow((rms / tse.length), 0.5);
    var tss = _.map(players, function (num, key) {
      return num.trueScore;
    });
    var G = average(tss).deviation / rmse;
    alpha = (Math.pow(G, 2) - 1) / Math.pow(G, 2);
  } else {
    alpha = 0;
  }
  return alpha;
};

var estimateCJ = function (task, players, controller) {
  players.forEach(function (player) {
    player.trueScore = 0;
    player.seTrueScore = 0;
  });

  for (var i = 4; i >= 0; i--) {
    cjEstimation(players, players.slice(0), i);
  }
  controller(task, players);
};

var cjEstimation = function (plyrs, players, iters) {
  for (var i = 0; i < plyrs.length; i++) {
    var plyr = plyrs[i];
    var myDec = plyr.decisions;
    var myTrueScore = plyr.trueScore;
    var myObs = plyr.observedScore;
    if (plyr.comparisons > 0) {
      var opps = _.map(myDec, function (id) {
        return _.find(players, function (pl) {
          return (pl._id == id);
        });
      });
      var myExp = _.reduce(opps, function (memo, num) {
        return memo + rasch(myTrueScore, num.trueScore);
      }, 0);
      //Calculate info
      var info = _.reduce(opps, function (memo, num) {
        return memo + rasch(myTrueScore, num.trueScore) * (1 - (rasch(myTrueScore, num.trueScore)));
      }, 0);
      if (iters > 0) {
        plyr.trueScore += ((plyr.observedScore - myExp) / info);
      } else {
        plyr.seTrueScore = 1 / Math.sqrt(info);
      }
    }
  }
};

module.exports = {
  rasch: rasch,
  average: average,
  estimateReliability: estimateReliability,
  resInfo: resInfo,
  estimateCJ: estimateCJ,
  cjEstimation: cjEstimation,
  probabilities: probabilities,
  judgeProbs: judgeProbs,
  getJudgeStats: getJudgeStats,
  playerProbs: playerProbs,
  getPlayerStats: getPlayerStats
};