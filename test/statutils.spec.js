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
  
} );