/* jshint -W024, expr:true */
/*jslint node: true */
/*global expect, fx, sinon*/
'use strict';

module.exports = {
    statutils : require('./lib/statutils'),
    estimation : require('./lib/estimation'),
    selection : require('./lib/selection'),
    simulation: require('./lib/simulation'),
    random: require('./lib/random')
};

var simulation = require('./lib/simulation');
var simulate = simulation.simulate;
var args = process.argv.slice(2);
var iters = +args[0];
var players = +args[1];
var judgements = +args[2];
var selection = args[3];
var thru = +args[4];
var AP = +args[5];

simulate(players, judgements, selection, thru, AP, iters, [], function(result){
  console.log('saved ',result, ' rows');
});