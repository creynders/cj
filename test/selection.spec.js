/* jshint -W024, expr:true */
/*global expect, fx, sinon*/
'use strict';
var selection = require('..').selection;
var _ = require('underscore');
var statutils = require( '..' ).statutils;

describe( 'selection', function(){

    describe( 'spec', function(){
        it( 'should pass', function(){
            expect( selection.selectionNonAdaptive).to.not.be.undefined();
        } );
        it( 'should pass', function(){
            expect( selection.selectionByJudge).to.not.be.undefined();
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
          pls.push({_id:i, selected:0, opponents:[], trueScore: (Math.random() * 5)-5, seTrueScore: 0.5 });
        }
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
        //Now go adaptive
        for(var j=0; j<100; j++){
          var pair = selection.selectionNonAdaptive(pls);
          expect(Math.abs(pair[0].trueScore - pair[1].trueScore)).to.be.below(0.5);
          for (var i=0; i <pls.length; i++){
            if(pls[i]._id == pair[0]._id){
              pls[i].selected ++;
              pls[i].opponents.push(pair[1]._id);
            }
            if(pls[i]._id == pair[1]._id){
              pls[i].selected ++;
              pls[i].opponents.push(pair[0]._id);
            }
          }
        }
      });
      it('for selection by judge, player should be the least judged by that judge.', function(){
        var pls = [];
        var judge = {_id:'j1'};
        var ids = ['a','b','c','d'];
        for (var i=0; i<ids.length; i++){
          pls.push({_id:ids[i]});
        }
        var decisions = [];
        decisions.push({chosen:'a',notChosen:'b',judge:'j2'});
        decisions.push({chosen:'a',notChosen:'d',judge:'j2'});
        //Get all pairs
        var pairs = [];
        for(var i=0;i<6;i++){
          var pair = selection.selectionByJudge(judge, pls, decisions);
          decisions.push({chosen:pair[0]._id, notChosen:pair[1]._id, judge:judge._id});
          pairs.push([pair[0]._id,pair[1]._id]);
        }
        //Check all pairs
        var combs = statutils.k_combinations(ids, 2);
        var diff = _.filter(combs, function(obj){ return !_.findWhere(pairs, obj) & !_.findWhere(pairs, [obj[1],obj[0]]);});
        expect(diff).eql([]);
        //All pairs exhausted
        var pair = selection.selectionByJudge(judge, pls, decisions);
        expect(pair).to.have.length(2);
      });
    });
});
