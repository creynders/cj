/* jshint -W024, expr:true */
/*jslint node: true */
/*global expect, fx, sinon*/
'use strict';

module.exports = {
    statutils : require('./lib/statutils'),
    estimation : require('./lib/estimation'),
    selection : require('./lib/selection'),
    simulation: require('./lib/simulation'),
    random: require('./lib/random'),
};

var simulation = require('./lib/simulation');
var byjudge = require('./lib/byjudge');
var program = require('commander');

program
  .version('0.0.1')
  .option('-b, --byjudge', 'Analyse by judge')
  .option('-d, --decisions [integer]', 'Csv file with decisions')
  .option('-s --simulate', 'Simulate a judging session')
  .option('-i --iters [integer]', 'Number of iterations to simulate')
  .option('-p --players [integer]', 'Number of players to simulate')
  .option('-j --judgements [integer]', 'Number of judgements to simulate in total')
  .option('-s --selection [string]', 'Script selection method')
  .option('-t --thru [integer]', 'Number of decisions expected per script - adaptive methods only')
  .option('-a --ap [float]', 'Acceleration parameter - adaptive methods only')
  .option('-sd --seed [integer]', 'Seed value for random parameters, integer value eg. 1234')
  .option('-e --exclude <items>', 'Items to be excluded from by judge analysis')
  .parse(process.argv);

if (program.simulate) {
  var sim = simulation.simulate;
  sim(program.players, program.judgements, program.selection, program.thru, program.a, program.iters, program.seed, [], function(result){
    console.log('saved ',result, ' rows');
  });
}

if(program.byjudge){
  var excluded = (program.exclude.split(','));
  byjudge.estimateByJudge(program.decisions, excluded,function(err, msg){
    if(err) console.log(err);
    console.log(msg);
  });
}