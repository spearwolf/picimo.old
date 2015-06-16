/* global Picimo */

var app  = new Picimo.App();
var node = new Picimo.sg.Node( app, { isRoot: true } );

node.on( 'init', function ( done ) {

    console.log( 'init-ializing ..' );

    done( new Promise( function ( resolve, reject ) {

        setTimeout( function () {

            console.log( '..done!' );
            resolve();
            // reject();

        }, 5000 );

    }));

});

node.on( 'initGl', function () {

    console.log( 'initGl' );

});

node.on( 'frame', function () {

    console.log( 'frame' );

});


console.log( "app", app );
console.log( "node", node );
