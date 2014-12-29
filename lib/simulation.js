/* jshint -W024, expr:true */
/*jslint node: true */
/*global expect, fx, sinon*/
/*jshint -W083 */
"use strict";
var _ = require('underscore');
var random = require('./random');
var selection = require('./selection');
var statutils = require('./statutils');
var estimation = require('./estimation');

var simulate = function(nCands, algorithm, thr, AP, seed){
  var result = [];
	// Give me some candidates with a theta and true score of zero
  var players = chooseCandidates(nCands,seed);
  // Select the algorithm
  var correlation = 0;
  var maxJudgements = 10;
  // Do judgements until correlation is 1 or maxJudgements has been reached
  var js = 0;
  doJudgements(algorithm, players, thr, AP, maxJudgements, function(players){
    console.log(players);
  });
  // Compare the rank order of the initial theta with the current true scores
  // Report the array with correlatons
  return result;
};

var doJudgements = function(algorithm, players, thr, AP, mx, callback){
  var estimateCJ = estimation.estimateCJ;
  doJudgement(algorithm, players, thr, AP, function(players){
    // Update true scores
    estimateCJ('1',players,function(task, players){
      //True scores updated
      mx--;
      if(mx>0){
        doJudgements(algorithm, players, thr, AP, mx, callback);
      } else {
        callback(players);
      }
    });
  });
};

var doJudgement = function(algorithm, players, thr, AP, callback){
  var select;
  if (algorithm=='adaptive'){
    select = selection.selectionAdaptive;
  } else {
    select = selection.selectionNonAdapative;
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
  callback(players);
};

var chooseCandidates = function(n, seed){
  //return n candidates with a random normal distribution of theta
  var Random = random.Random;
  var stream1 = new Random(seed);
  // Create an array for simulation
  var simCands = [];
  for (var i=0; i<n; i++){
    simCands.push({_id:i,selected:0, comparisons:0, observedScore:0, trueScore:0,theta:stream1.normal(0,1), opponents:[],decisions:[]});
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