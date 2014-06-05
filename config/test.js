'use strict';

module.exports = function( grunt,
                           opts ){
    return {
        tasks : {
            mochaTest : {
                specs : {
                    options : {
                        reporter : 'spec',
                        require  : 'test/common.js'
                    },
                    src     : ['test/**/*.spec.js']
                }
            },
            benchmark : {
                options: {
                  // This can also be set inside specific tests.
                  displayResults: true
                },
                all     : {
                    src  : ['benchmarks/*.js'],
                    dest : 'benchmarks/results.csv'
                }
            }
        }
    }
}