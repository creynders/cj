/* jshint -W024, expr:true */
/*global expect, fx, sinon*/
'use strict';
var statutils = require( '..' ).statutils;

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
  
});