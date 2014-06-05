'use strict';

var statutils = require( '..' ).statutils;
var _ = require( 'underscore' );
var fx = require( '../test/data' );

module.exports = {
    name  : 'Statutils',
    tests : {
        'statutils.rasch'   : function(){
            statutils.rasch( .25, .5 );
            statutils.rasch( 0, 0 );
        },
        'statutils.average' : function(){
            statutils.average( _.pluck( fx.decisions, 'timeTaken' ) );
            statutils.average( [] );
        },
        'statutils.resInfo' : function(){
            statutils.resInfo( .5 );
        },
        'statutils.info'    : function(){
            statutils.info( .5 );
        },
        'statutils.zsq'     : function(){
            statutils.zsq( .5 );
        },
        'statutils.wms'     : function(){
            statutils.wms( _.pluck( fx.decisions, 'timeTaken' ) );
        }
    }
};