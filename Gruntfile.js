'use strict';
module.exports = function(grunt){
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt);
    
    grunt.initConfig(require('load-grunt-configs')(grunt));
    
    grunt.registerTask('test', ['mochaTest']);
}