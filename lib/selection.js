/* jshint undef: false, strict: false */
// Turn off strict mode for this function so we can assign to global
(function( root,
           factory ){

    /*
     AMD/CommonJS compatibility largely stolen from https://github.com/kriskowal/q/blob/master/q.js
     */

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the depres API and when
    // executed as a simple <script>, it creates a depres global instead.

    // CommonJS
    if( "object" === typeof exports ){
        module.exports = factory( require( 'underscore' ) );

        // RequireJS
    }else if( "function" === typeof define && define.amd ){
        define( ["underscore"], factory );

        // <script>
    }else{
        root.cj = factory( root._ );
    }

})( this, function( _ ){
    "use strict";

// Chris's selection method
    function selectionNonAdaptive( players ){
        //shuffle and sort the players to get a pseudo-random distribution
        players = _.sortBy( _.shuffle(players), function(player){
            return player.selected;
        });
        var player = players.shift();
        var opponent;
        //First decision? Choose the player with the next fewest decisions
        if( player.selected <= 0 ){
            opponent = players.shift();
        } else {
          //Find a player not yet compared to
            opponent = _.find(players, function(candidate){
                return ! _.contains(candidate.opponents, player._id);
            });
        }
        if(! opponent){
            //All matches have been made, go adaptive
            //Get everyone who is not himself within standard error
            var gt = player.trueScore - player.seTrueScore;
            var lt = player.trueScore + player.seTrueScore;

            opponent = _.find(players, function(candidate){
                return candidate.trueScore > gt && candidate.trueScore < lt;
            }) || players.shift();
        }
        // Update Judges Collection with current pair information
        return [player, opponent];
    };

    function selectionAdaptive(){
      //here be some more code
    };

    function selectionByJudge(idJudge, players, decisions){
      // Every judge should see each possible pair
      var statutils = require( '..' ).statutils;
      // List of ids
      var pls = _.pluck(players, '_id');
      // Every possible combination of ids
      var k_combinations = statutils.k_combinations;
      var combs = k_combinations(pls, 2);
      // Filter decisions by judge
      var dec = _.filter(decisions, function(decision){ return decision.judge == idJudge; });
      //console.log('dec: ', dec);
      // Get a list of all combinations so far
      var pl1 = _.pluck(dec, 'chosen');
      var pl2 = _.pluck(dec, 'notChosen');
      //console.log('pl1: ', pl1);
      //console.log('pl2: ', pl2);
      var pairs = _.zip(pl1,pl2);
      //console.log('combs: ', combs);
      //console.log('pairs', pairs);
      var diff = _.filter(combs, function(obj){ return !_.findWhere(pairs, obj) & !_.findWhere(pairs, [obj[1],obj[0]]);});
      //If diff, then not all pairs have been selected
      var pair;
      if (diff.length > 0){
        pair = _.shuffle(diff).shift();
      } else {
        //If all pairs chosen, choose a random pair
        pair = _.shuffle(combs).shift();
      }
      var player1 = _.findWhere(players, {_id: pair[0]});
      var player2 = _.findWhere(players, {_id: pair[1]});
      return [player1,player2];
    };

    return {
      selectionAdaptive: selectionAdaptive,
      selectionNonAdaptive : selectionNonAdaptive,
      selectionByJudge: selectionByJudge,
    };

} );
