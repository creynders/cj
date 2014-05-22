//exposes all files in this directory in a key-value pair map
//with file names (w/o extension) as keys and the contents of the files as values
module.exports = require( 'require-directory' )( module );