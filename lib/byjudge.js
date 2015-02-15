// Read in a set of decisions
// Find all the judges in those decisions
// Build up a set of players from those decisions
// Estimate the player stats, one by one
// Save out to csv

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
var async = require('async');
var fs = require("fs");

var estimateByJudge = function(csvFile, exclude ,callback){
  var decisions = [];
  var judges = [];
  var players = [];
  var playersByJudge =[];
  async.series([
    function(callback){
      csv
        .fromPath(csvFile, {headers:true})
        .on("data", function(data){
          decisions.push(data);
        })
        .on("end", function(){
          callback();
        });
    },
    function(callback){
      if(exclude){
        for (var i=0; i<exclude.length; i++){
          decisions = _.filter(decisions, function(decision){return (decision['Candidate Chosen']!= exclude[i] && decision['Candidate Not Chosen']!= exclude[i]);});
        }
      }
      judges = _.uniq(_.pluck(decisions, 'Judge'));
      async.each(judges, function(judge, callback){
        var myDecisions = _.filter(decisions, function(decision){return decision.Judge == judge;});
        var chosen  = _.uniq(_.pluck(decisions, 'Candidate Chosen'));
        var notChosen = _.uniq(_.pluck(decisions, 'Candidate Not Chosen'));
        var playerIds = _.union(chosen, notChosen);
        var myPlayers = [];
        for(var i=0; i<playerIds.length; i++){
          myPlayers.push(
            {
              _id: playerIds[i],
              comparisons: 0,
              observedScore: 0,
              trueScore: 0,
              seTrueScore: 0,
              selected: 0,
              infit: 0,
              decisions: [],
              opponents: []
            }
          );
        }
        rebuildPlayers(myPlayers, myDecisions);
        estimation.estimateCJ('',myPlayers, function(task, estPlayers){
          for(var k=0; k<estPlayers.length; k++){
            estPlayers[k].judge = judge;
            playersByJudge.push(estPlayers[k]);
          }
          callback();
        });
      }, function(err, msg){
        if(err) return callback(err);
        callback();
      });
    },
    function(callback){
      //save scripts collection to csv
      var fn = Date.now() + '.csv';
      var ws = fs.createWriteStream(fn);
      csv
        .write(playersByJudge, {
          headers: true,
          transform: function(row){
            return {
                id: row._id,
                comparisons: row.comparisons,
                observedScore: row.observedScore,
                trueScore: row.trueScore,
                seTrueScore: row.seTrueScore,
                judge: row.judge,
            };
          }
        })
        .pipe(ws);
      callback();
    }
  ], function(err){
    if(err) return callback(err);
    callback(err, 'estimation complete');
  });
};

var rebuildPlayers = function(players,decisions){
  var decision;
  for (var j = 0; j < decisions.length; j++) {
    decision = decisions[j];
    //Find the winner and increment their score
    var winner = _.find(players, function(player) {return player._id==decision['Candidate Chosen'];});
    var loser = _.find(players, function(player) {return player._id==decision['Candidate Not Chosen'];});
    winner.observedScore ++;
    if(!_.contains(winner.opponents, loser._id)) winner.opponents.push(loser._id);
    if(!_.contains(loser.opponents, winner._id)) loser.opponents.push(winner._id);
    winner.decisions.push(loser._id);
    loser.decisions.push(winner._id);
    winner.comparisons++;
    winner.selected++;
    loser.comparisons++;
    loser.selected++;
  }
};

module.exports = {
  estimateByJudge:estimateByJudge,
};