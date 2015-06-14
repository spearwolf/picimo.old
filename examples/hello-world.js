
var path   = require( 'path' );
var Picimo = require( path.join( __dirname, '..', 'dist', 'picimo' ) );

var app = new Picimo.App();

console.log( "Picimo.App" );
console.dir( app );
