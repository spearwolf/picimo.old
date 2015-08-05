/* global Picimo */

console.log( 'welcome to the %c %cnobinger%c benchmark v1 %c%c a picimo demo! ', 'background-color:yellow', 'font-style:italic;background-color:yellow', 'font-style:normal;background-color:yellow', 'background-color:transparent', 'background-color:red;color:#fff' );

// Setup
var app = new Picimo.App({

    canvas : document.getElementById( 'picimo' ),
    alpha  : true,

});

// Set pixel resolution
app.scene.setSize( 800, 600, "contain" );

// Load a texture atlas
var atlas = app.loadTextureAtlas( './nobinger.json' );


var spriteGroup = app.scene.appendSpriteGroup( atlas, { capacity: 5000 }, {

    init: function ( spriteGroup ) {

        console.log( "spriteGroup ready!", spriteGroup.textureAtlas.frameNames.join( ", " ) );
    
    },

});


window.spriteGroup = spriteGroup;  // DEBUG















/*
app.loadTextureAtlas( './nobinger.json' ).then( function ( atlas ) {

    console.debug( "loaded TextureAtlas", atlas );

    var spriteGroup = app.scene.addChild( new Picimo.sg.SpriteGroup( app, { textureAtlas: atlas } ) );

    spriteGroup.on( "initGl", function () {

        console.log( "spriteGroup initialized: ", this.textureAtlas.frameNames.join( ", " ) );
    
    });

});
*/

/*
    .on( "init", function () {

        console.log( "spriteGroup initialized:", this.textureAtlas.frameNames.join( ", " ) );

    }) ;
    */

