/* jshint -W024, expr:true */
/*jslint node: true */
/*jslint mocha: true */
/*global expect, fx, sinon*/
'use strict';
var simulation = require('..').simulation;

describe('iterate', function(){
	it('should return an array of players', function(){
		expect(simulation.iterate).to.not.be.undefined();
		var iterate = simulation.iterate;
		var iters = 2;
		var players =4;
		var judgements = 2 * players;
		var selection = 'adaptive';
		var thru = judgements;
		var AP =1;
		iterate(iters, players, judgements, selection, thru, AP, function(result){
			//console.log(result);
		});
	});
});

describe('simulation', function(){
	describe('spec', function(){
		it('should have access to simulation', function(){
			expect(simulation).to.not.be.undefined();
		});
		it('should have access to the fixtures', function(){
			expect(fx.players).to.not.be.undefined();
		});
		it('should return an array with players', function(){
			expect(simulation.simulate).to.not.be.undefined();
			var simulate = simulation.simulate;
			var sim1 = simulate(8, 20, 'adaptive', 20, 1, function(players){
				//console.log(players);
			});
		});
	});

	describe('spec', function(){
			it('should have a function called chooseCandidates',function(){
				var chooseCandidates = simulation.chooseCandidates;
				expect(chooseCandidates).to.not.be.undefined();
			});
		});
});

describe('chooseCandidates', function(){
	it('should return n candidates with a true score', function(){
		var chooseCandidates = simulation.chooseCandidates;
		var n = 10;
		var seed = 1234;
		var simCands = chooseCandidates(n, seed);
		expect(simCands.length).to.equal(10);
		// expect a value of theta and a true score to be equal to 0
		for(var i=0; i<n; i++){
			expect(simCands[i].theta).to.not.be.undefined();
			expect(simCands[i].trueScore).to.equal(0);
		}
	});
});

describe('simJudgement', function(){
	var simJudgement = simulation.simJudgement;
	it('should return a judgement of 0 or 1', function(){
		var theta = 0;
		var delta = 0;
		var judgement = simJudgement(theta, delta);
		expect([0,1]).to.include(judgement);
	});
	it('should return more wins for better script', function(){
		var theta = 1;
		var delta = 0;
		var j = 0;
		for (var i=0; i<100; i++){
			j += simJudgement(theta, delta);
		}
		expect(j).to.be.above(50);
	});
});

describe('recordJudgement', function(){
	var recordJudgement = simulation.recordJudgement;
	it('should not be undefined', function(){
		expect(recordJudgement).to.not.be.undefined();
	});
	it('should return increments', function(){
		var player = {comparisons:0, selected:0, observedScore:0, opponents:[], decisions:[]};
		player = recordJudgement(player,1,2);
		expect(player.comparisons).to.equal(1);
		expect(player.selected).to.equal(1);
		expect(player.observedScore).to.equal(1);
		expect(player.opponents).to.include(2);
		expect(player.decisions).to.include(2);
	});
});