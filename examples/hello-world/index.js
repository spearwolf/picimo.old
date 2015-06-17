/* global Picimo */

var app  = new Picimo.App();
var node = new Picimo.sg.Node( app, { isRoot: true } );

node.on( 'init', function ( done ) {

    console.log( 'init-ializing ..' );

    done( function ( resolve, reject ) {

        setTimeout( function () {

            console.log( '..done!' );
            resolve();
            // reject();

        }, 5000 );

    });

});

node.on( 'initGl', function ( done ) {

    console.log( 'initGl..' );

    done( new Promise( function ( resolve, reject ) {

        console.log( '..done!' );
        resolve();
        // console.log( '..failed!' );
        // reject();

    }));

});

node.on( 'frame', function () {

    console.log( 'frame' );

});

node.on( 'destroy', function () {

    console.log( 'destroy' );

});

node.on( 'destroyGl', function () {

    console.log( 'destroyGl' );

});
console.log( "app", app );
console.log( "node", node );
