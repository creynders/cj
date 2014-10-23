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
    return function selectionNonAdaptive( players ){
        //shuffle and sort the players to get a pseudo-random distribution
        players = _.sortBy( _.shuffle(players), function(player){
            return player.selected;
        });
        var player = players.shift();
        var opponent;
        //First decision? Choose the player with the next fewest decisions
        if( player.selected <= 0 ){
            opponent = players.shift();
        }else{
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
} );
