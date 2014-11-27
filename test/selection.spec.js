/* jshint -W024, expr:true */
/*global expect, fx, sinon*/
'use strict';
var selection = require('..').selection;
var _ = require('underscore');

describe( 'selection', function(){

    describe( 'spec', function(){
        it( 'should pass', function(){
            expect( selection.selectionNonAdaptive).to.not.be.undefined();
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
        var pair = selection.selectionNonAdaptive(pls);
        expect(pair[0].selected).to.be.equal.to(mn);
      });
      it('should be an opponent not compared to yet if possible', function(){
        var pls = [];
        for (var i=0; i<100; i++){
          pls.push({_id:i, selected:0, opponents:[]});
        }
        //Should have [0,1],[0,2],[1,2]
        for(var j=0; j<4950; j++){
          var pair = selection.selectionNonAdaptive(pls);
          for (var i=0; i <pls.length; i++){
            if(pls[i]._id == pair[0]._id){
              pls[i].selected ++;
              pls[i].opponents.push(pair[1]._id)
            }
            if(pls[i]._id == pair[1]._id){
              pls[i].selected ++;
              pls[i].opponents.push(pair[0]._id)
            }
          }
        }
        for(var i=0; i<pls.length; i++){
          expect(pls[i].selected).to.be.equal.to(99);
          expect(pls[i].opponents.length).to.be.equal.to(_.uniq(pls[i].opponents).length);
        }
      });
    });
});
