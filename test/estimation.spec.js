/* jshint -W024, expr:true */
/*global expect, fx, sinon*/
'use strict';
var estimation = require( '..' ).estimation;

describe( 'estimation', function(){

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

    describe('estimateReliability', function(){
      var estimateReliability = estimation.estimateReliability;
      it( 'should return correct reliability', function(){
            expect( estimateReliability( [] ) ).to.equal( 0 );
            expect( estimateReliability( fx.players ) ).to.be.between( 0.89,0.91 );
        } );
    });
  
} );