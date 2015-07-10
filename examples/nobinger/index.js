/* global Picimo */

console.log( 'welcome to the %c %cnobinger%c benchmark v1 %c%c a picimo demo! ', 'background-color:yellow', 'font-style:italic;background-color:yellow', 'font-style:normal;background-color:yellow', 'background-color:transparent', 'background-color:red;color:#fff' );

// Setup picimo app
var app = new Picimo.App({

    canvas : document.getElementById( 'picimo' ),
    alpha  : true,

});

// Pixel resolution
app.scene.setSize( 800, 600, "contain" );

// Load a texture atlas
var atlas = app.loadTextureAtlas( './nobinger.json' );


app.scene.appendSpriteGroup( atlas, null, {

    init: function ( spriteGroup ) {

        console.log( "spriteGroup ready!", spriteGroup.textureAtlas.frameNames.join( ", " ) );
    
    },

});




/*
 * TODO
 * ====
 *
 * - move renderPrio flag and childrenUpdated event one-level up to Node (is Scene)
 *
 */



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

