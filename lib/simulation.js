/* jshint -W024, expr:true */
/*jslint node: true */
/*global expect, fx, sinon*/
/*jshint -W083 */
"use strict";
var _ = require('underscore');
var csv = require('fast-csv');
var random = require('./random');
var selection = require('./selection');
var statutils = require('./statutils');
var estimation = require('./estimation');

var simulate = function(nCands, nJudgements, algorithm, thr, AP, iters, seed, results, callback){
    if(iters>0){
      // Give me some candidates with a theta and true score of zero
      var players = chooseCandidates(nCands,2,1,1234);
      // Do judgements until nJudgements has been reached
      doJudgements(algorithm, players, thr, AP, nJudgements, [], function(players){
        //Push results to array, along with number of judgement
        for(var i=0; i<players.length; i++){
          var pl = {};
          pl.iteration = iters;
          pl.judgement = nJudgements - players[i].judgement + 1;
          pl._id = players[i]._id;
          pl.observedScore = players[i].observedScore;
          pl.comparisons = players[i].comparisons;
          pl.trueScore = players[i].trueScore;
          pl.theta = players[i].theta;
          pl.seTrueScore = players[i].seTrueScore;
          results.push(pl);
        }
        process.nextTick(function() {simulate(nCands, nJudgements, algorithm, thr, AP, --iters, seed, results, callback);});
      });
    } else {
        csv
          .writeToPath("out.csv", results, {headers: true})
          .on("finish", function(){
            callback(results.length);
          });
    }
};

var doJudgement = function(algorithm, players, thr, AP){
  var select;
  if (algorithm=='adaptive'){
    select = selection.selectionAdaptive;
  } else {
    select = selection.selectionNonAdaptive;
  }
  var pair;
  // Get a pair
  if(algorithm=='adaptive'){
    pair = select(players, thr, AP);
  } else {
    pair = select(players);
  }
  var left = _.find(players, function(player){ return player._id == pair[0]._id; });
  var right = _.find(players, function(player){ return player._id == pair[1]._id; });
  // Simulate a judgement
  var j = simJudgement(left.theta, right.theta);
  var k = j==1?0:1;
  left = recordJudgement(left, j, right._id);
  right = recordJudgement(right, k, left._id);
};

var doJudgements = function(algorithm, players, thr, AP, mx, results, callback){
  var estimateCJ = estimation.estimateCJ;
  doJudgement(algorithm, players, thr, AP);
  // Update true scores
  estimateCJ('1',players,function(task, players){
    //True scores updated
    //Push results to array, along with number of judgement
    for(var i=0; i<players.length; i++){
      var pl = {};
      pl.judgement = mx;
      pl._id = players[i]._id;
      pl.observedScore = players[i].observedScore;
      pl.comparisons = players[i].comparisons;
      pl.trueScore = players[i].trueScore;
      pl.theta = players[i].theta;
      pl.seTrueScore = players[i].seTrueScore;
      results.push(pl);
    }
    mx--;
    if(mx>0){
      return doJudgements(algorithm, players, thr, AP, mx, results, callback);
    } else {
      callback(results);
    }
  });
};

var chooseCandidates = function(n, mean, sd, seed){
  //return n candidates with a random normal distribution of theta
  mean?mean:0;
  sd?sd:1;
  var Random = random.Random;
  var stream1;
  if(seed){
    stream1 = new Random(seed);
  } else {
    stream1 = new Random();
  }
  // Create an array for simulation
  var simCands = [];
  for (var i=0; i<n; i++){
    simCands.push({_id:i,selected:0, comparisons:0, observedScore:0, trueScore:0,theta:stream1.normal(mean,sd), opponents:[],decisions:[]});
  }
  return simCands;
};

var simJudgement = function(theta, delta){
  var Random = random.Random;
  var rasch = statutils.rasch;
  var p = rasch(theta, delta);
  var stream1 = new Random();
  var runif = stream1.random();
  var judgement = runif < p?1:0;
  return judgement;
};

var recordJudgement = function(player, win, opponent){
  player.comparisons ++;
  player.selected++;
  player.observedScore += win;
  if(!_.contains(player.opponents)){
    player.opponents.push(opponent);
  }
  player.decisions.push(opponent);
  return player;
};

module.exports = {
  chooseCandidates:chooseCandidates,
  simJudgement: simJudgement,
  recordJudgement: recordJudgement,
	simulate:simulate,
};