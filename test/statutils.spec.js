/* jshint -W024, expr:true */
/*global expect, fx, sinon*/
'use strict';
var statutils = require( '..' ).statutils;
var _ = require('underscore');

describe( 'statutils', function(){

    describe( 'spec', function(){
        it( 'should pass', function(){
            expect( true ).to.equal( true );
        } );
        it( 'should have access to the fixtures', function(){
            expect( fx.decisions ).to.not.be.undefined();
            expect( fx.judges ).to.not.be.undefined();
            expect( fx.players ).to.not.be.undefined();
            expect( fx.tasks ).to.not.be.undefined();
        } );
    } );

    describe( 'rasch', function(){
        var rasch = statutils.rasch;
        it( 'should return 0.5 when the ability equals the difficulty', function(){
            expect( rasch( 0, 0 ) ).to.equal( 0.5 );
        } );
    } );

    describe('info', function(){
      var info = statutils.info;
      it('should return p * (1-p)',function(){
          expect(info(0.5)).to.equal(0.25);
          expect(info(0.3)).to.equal(0.21);
          expect(info(0.9)).to.be.between(0.0899,0.09);
      })
    });

    describe('zsq', function(){
      var zsq = statutils.zsq;
      it('should return res ^ 2 / info',function(){
          expect(zsq(0.5)).to.equal(1);
          expect(zsq(0.1)).to.equal(9);
          expect(zsq(0.99)).to.be.between(0.01010101,0.01010102);
      })
    });

    describe('wms', function(){
      var wms = statutils.wms;
      var probs = [0.5,0.5,0.5,0.5];
      var probs1 = [0.1,0.2,0.3,0.05];
      var probs2 = [0.8,0.7,0.6,0.9];
      it('should return sum info * zsq / sum info', function(){
          expect(wms(probs)).to.equal(1);
          expect(wms([])).to.equal(0);
          expect(wms(probs1)).to.be.above(1);
          expect(wms(probs2)).to.be.below(1);
      })
    });

    describe('k_combinations', function(){
      var k_combinations = statutils.k_combinations;
      var combs = k_combinations([1, 2, 3], 2);
      var expectedCombs =  [[1,2], [1,3], [2, 3]];
      expect(combs).eql(expectedCombs);
    });

    describe('factorial',function(){
      var factorial = statutils.factorial;
      expect(factorial(3)).to.equal(6);
      expect(factorial(4)).to.equal(24);
    });

    describe('wq', function(){
      var wq = statutils.wq;
      expect(wq(4,5,1)).to.equal(5);
      expect(wq(2,5,1)).to.equal(1.5);
      var out = +wq(4,20,1).toFixed(4);
      expect(out).to.equal(1.0526);
    });

    describe('iI', function(){
      var iI = statutils.iI;
      var ii = iI(0,[0,0]);
      expect(ii).eql([0.25,.25]);
      var ii = iI(0,[-5,-4.5,-4]);
      var ii = _.map(ii, function(i){return (+i.toFixed(4))});
      expect(ii).eql([0.0066,0.0109,0.0177]);
      var ii = iI(0,[-5,-4,-3]);
      var ii = _.map(ii, function(i){return (+i.toFixed(4))});
      expect(ii).eql([0.0066,0.0177,0.0452]);
      var ii = iI(4.15,[5.05,5.05,-4.15,-4.15,-5.05]);
      var ii = _.map(ii, function(i){return (+i.toFixed(4))});
      expect(ii).eql([0.2055,0.2055,0.0002,0.0002,0.0001]);
    });

    describe('calciPR', function(){
      var calciPR = statutils.calciPR;
      var theta = 0;
      var items = [-5,-4,-3,-2,-1,0,1,2,3,4,5];
      var thr = 20;
      var done = 4;
      var AP = 1;
      var iPr = calciPR(theta, items, done, thr, AP);
      var iPr = _.map(iPr, function(i){return +i.toFixed(4)});
      expect(iPr).eql([0.0057,0.0160,0.0429,0.1041,0.2016,0.2596,0.2016,0.1041,0.0429,0.0160,0.0057]);
      var theta = 5.47;
      var items = [5.45,2.33,-0.12,-2.57,-6.02];
      var thr = 20;
      var done = 2;
      var AP = 1;
      var iPr = calciPR(theta, items, done, thr, AP);
      var iPr = _.map(iPr, function(i){return +i.toFixed(4)});
      expect(iPr).eql([0.5031,0.2816,0.1331,0.0615,0.0207]);
      var theta = 5.47;
      var items = [5.45,2.33,-0.12,-2.57,-6.02];
      var thr = 20;
      var done = 22;
      var AP = 1;
      var iPr = calciPR(theta, items, done, thr, AP);
      var iPr = _.map(iPr, function(i){return +i.toFixed(4)});
      expect(iPr).eql([1,0,0,0,0]);
    });

    describe('sampleVector', function(){
      var sampleVector = statutils.sampleVector;
      var vec = [0.0057,0.0160,0.0429,0.1041,0.2016,0.2596,0.2016,0.1041,0.0429,0.0160,0.0057];
      var runif = 0.2;
      var chosen = sampleVector(vec,runif);
      expect(chosen).to.equal(4);
    });

});
