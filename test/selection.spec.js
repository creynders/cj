/* jshint -W024, expr:true */
/*global expect, fx, sinon*/
'use strict';

describe( 'selection', function(){

    describe( 'spec', function(){
        it( 'should pass', function(){
            expect( selectionNonAdaptive ).to.not.be.undefined();
        } );
        it( 'should have access to the fixtures', function(){
            expect( fx.decisions ).to.not.be.undefined();
            expect( fx.judges ).to.not.be.undefined();
            expect( fx.players ).to.not.be.undefined();
            expect( fx.tasks ).to.not.be.undefined();
        } );
    } );

    describe('selection algorithms', function(){
      it('should always choose the player with the fewest selections', function(){
        var pls = [];
        var mn = 100;
        for(var i=0; i<100; i++){
          var selected = Math.floor(Math.random() * 100) + 1;
          var mn = (selected < mn ? selected : mn);
          pls.push({selected:selected});
        }
      });
    });
});
