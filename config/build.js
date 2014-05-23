'use strict';

var path = require('path');

module.exports = function(grunt, opts){
    var sourceFiles = [ '<%= paths.src %>/selection.js'];
    var distFile = '<%= paths.dist %>/<%= pkg.name %>.js';
    var minFile = '<%= paths.dist %>/<%= pkg.name %>.min.js';
    var banner = '/*! <%= pkg.name %> - ' +
        'v<%= pkg.version %> - ' +
        '(c) <%= grunt.template.today("yyyy") %> ' +
        '<%= pkg.author.name %>; ' +
        'Licensed <%= pkg.license %> */';
    return {
        tasks : {
            clean : {
                dist : opts.paths.dist
            },
            
            concat : {
                source : {
                    src : sourceFiles,
                    dest : distFile
                }
            },
            
            uglify : {
                source : {
                    options : {
                        banner : banner
                    },
                    src : distFile,
                    dest : minFile
                }
            }
        }
    }
}