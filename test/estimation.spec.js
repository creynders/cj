/* jshint -W024, expr:true */
/*global expect, fx, sinon*/
'use strict';
var estimation = require( '..' ).estimation;
var statutils = require( '..' ).statutils;

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
  
    describe('probabilities', function(){
      var probabilities = estimation.probabilities;
      var player1 = new Object(); 
      player1.trueScore = 3;
      player1._id = 1
      var player2 = new Object(); 
      player2.trueScore = 3;
      player2._id = 2
      var players = [player1,player2];
      var decision = new Object();
      decision.chosen = player1._id;
      decision.notChosen = player2._id;
      var decisions = [decision];
      it( 'should return probabilities', function(){
            expect( probabilities( [] ,[]).length ).to.equal( 0 );            
            expect( probabilities( players , decisions )[0]).to.equal( 0.5 );
            player2.trueScore = -1;
            expect( probabilities( players , decisions )[0]).to.be.above( 0.5 );
            player2.trueScore = 4;
            expect( probabilities( players , decisions )[0]).to.be.below( 0.5 );
            expect( probabilities( fx.players , fx.decisions ).length).to.equal(fx.decisions.length);
            var probs = probabilities(fx.players , fx.decisions);
            expect(statutils.wms(probs)).to.be.between(0.9,1.1);
        } );
    });

    describe('playerProbs', function(){
      var probabilities = estimation.probabilities;
      var playerProbs = estimation.playerProbs;
      var getPlayerStats = estimation.getPlayerStats;
      it( 'should return correct player infit', function(){
        var chosen = ["p2","p4","p2","p2","p4","p1","p1","p4","p3","p4","p2","p2","p2","p4","p3","p1","p4","p1","p3","p3"];
        var notChosen = ["p1","p2","p4","p3","p2","p3","p3","p1","p1","p1","p1","p3","p4","p2","p1","p2","p3","p2","p1","p2"];
        var players = [];
        var playerids = ["p1","p2","p3","p4"];
        var trueScores = [0.0000000,0.6797836,0.1528288,1.5665183];
        var btProbs =[0.6636904,0.7082159,0.2917841,0.6287726,0.7082159,0.4618670,0.4618670,0.8272867,0.5381330,0.8272867,0.6636904,0.6287726,0.2917841,0.7082159,0.5381330,0.3363096,0.8043472,0.3363096,0.5381330,0.3712274];
        var btInfit = [0.9854036,1.1562654,0.9181268,0.9188028];
        for(var i=0; i<playerids.length; i++){
          players.push({_id:playerids[i],trueScore:trueScores[i]});  
        }
        var decisions = [];
        for(i=0;i<chosen.length;i++){
          decisions.push({chosen:chosen[i],notChosen:notChosen[i]});  
        }
        var probs = probabilities(players , decisions);
        //Script 1 in 11 decisions
        expect(playerProbs(players[0],probs,decisions).length).to.equal(11);
        for (i=0; i<probs.length; i++){
          expect(probs[i].toFixed(2)).to.equal(btProbs[i].toFixed(2));
        }
        //Check stats for scripts
        var infit = getPlayerStats(players, probs, decisions);
        for (i=0;i<infit.length;i++){
          expect(infit[i].toFixed(2)).to.equal(btInfit[i].toFixed(2));  
        }
      });
    });  
  
    describe('judgeProbs', function(){
      var probabilities = estimation.probabilities;
      var judgeProbs = estimation.judgeProbs;
      var getJudgeStats = estimation.getJudgeStats;
      var player1 = new Object(); 
      player1.trueScore = 3;
      player1._id = 1
      var player2 = new Object(); 
      player2.trueScore = 3;
      player2._id = 2
      var players = [player1,player2];
      var decision = new Object();
      decision.chosen = player1._id;
      decision.notChosen = player2._id;
      var judge1 = new Object();
      judge1._id = 123;
      decision.judge = judge1._id;
      var judge2 = new Object();
      judge2._id = 124;
      var decisions = [decision];
      var judges = [judge1,judge2];
      it( 'should return judges probs', function(){
        var probs = probabilities(players , decisions);
        expect(judgeProbs(judge1,probs,decisions)[0]).to.equal(0.5);
        expect(judgeProbs(judge2,probs,decisions).length).to.equal(0);
        expect(getJudgeStats(judges, probs, decisions)).to.eql([1,0]);
        probs = probabilities(fx.players , fx.decisions);
        var infit = getJudgeStats(fx.judges, probs, fx.decisions);
        for (var i=0; i<infit.length; i++){
          if(fx.judges[i].hasOwnProperty('trueScore')){
            expect(fx.judges[i].trueScore.toFixed(4)).to.eql(infit[i].toFixed(4));    
          }          
        }
      });
    });
  
});