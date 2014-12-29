/* jshint -W024, expr:true */
/*jslint node: true */
/*global expect, fx, sinon*/
'use strict';
var random = require('..').random;
var statutils = require('..').statutils;

describe('selection', function () {
  describe('random spec', function () {
    it('should pass', function () {
      expect(random).to.not.be.undefined();
      expect(random.Random).to.not.be.undefined();
    });
  });
});

describe('Random', function(){
  it('should return the same random number given a seed', function(){
    /* Demonstrate that random number streams can be seeded,
    * and multiple streams can be created in a single script. */
    var Random = random.Random;
    var stream1 = new Random(1234);
    var stream2 = new Random(6789);
    expect(stream1.random()).to.equal(0.966453535715118);
    expect(stream2.random()).to.equal(0.13574991398490965);
  });
  it('should return a random normal distribution', function(){
    var Random = random.Random;
    var stream1 = new Random(1234);
    var rnd = [];
    for(var i =0; i<100000; i++){
      rnd.push(stream1.normal(0,1));
    }
    var avg = statutils.average(rnd);
    expect(+avg.mean.toFixed(2)).to.equal(0);
    expect(+avg.deviation.toFixed(2)).to.equal(1);
  });
});