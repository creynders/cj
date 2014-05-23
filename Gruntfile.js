'use strict';
module.exports = function( grunt ){
    require( 'time-grunt' )( grunt );
    require( 'jit-grunt' )( grunt );

    var config = {
        pkg   : grunt.file.readJSON( 'package.json' ),
        paths : {
            src  : 'lib',
            dist : 'dist'
        }
    };

    grunt.initConfig( require( 'load-grunt-configs' )( grunt, config ) );

    grunt.registerTask( 'test', ['mochaTest'] );
    grunt.registerTask( 'build', [
        'clean:dist',
        'concat:source',
        'uglify:source'
    ] );

    grunt.registerTask( 'default', ['test', 'build'] );
};