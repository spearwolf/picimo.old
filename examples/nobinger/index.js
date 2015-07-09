/* global Picimo */

console.log( 'welcome to the %c %cnobinger%c benchmark v1 %c%c a picimo demo! ', 'background-color:yellow', 'font-style:italic;background-color:yellow', 'font-style:normal;background-color:yellow', 'background-color:transparent', 'background-color:red;color:#fff' );

var app  = new Picimo.App({

    canvas : document.getElementById( 'picimo' ),
    alpha  : true,

});


app.loadTextureAtlas( './nobinger.json' ).then( function ( atlas ) {

    console.debug( "loaded TextureAtlas", atlas );

});

