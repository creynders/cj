/* jshint -W024, expr:true */
/*global expect, fx, sinon*/
'use strict';

describe( 'functions', function(){

    describe( 'spec', function(){
        it( 'should pass', function(){
            expect( true ).to.equal( true );
        } );
        it('should have access to the fixtures', function(){
            expect(fx.decisions ).to.not.be.undefined(); 
            expect(fx.judges ).to.not.be.undefined(); 
            expect(fx.players ).to.not.be.undefined(); 
            expect(fx.tasks).to.not.be.undefined(); 
        });
    } );

} );