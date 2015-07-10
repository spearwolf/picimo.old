/* global Picimo */

console.log( 'welcome to the %c %cnobinger%c benchmark v1 %c%c a picimo demo! ', 'background-color:yellow', 'font-style:italic;background-color:yellow', 'font-style:normal;background-color:yellow', 'background-color:transparent', 'background-color:red;color:#fff' );

var app = new Picimo.App({

    canvas : document.getElementById( 'picimo' ),
    alpha  : true,

});


app.root.appendSpriteGroup( app.loadTextureAtlas( './nobinger.json' ), null, {

    init: function ( spriteGroup ) {

        console.log( "spriteGroup ready!", spriteGroup.textureAtlas.frameNames.join( ", " ) );
    
    },

    frame: function ( spriteGroup ) {

        if ( spriteGroup.app.frameNo % 666 === 0 ) {
        
            console.debug( "frameNo", spriteGroup.app.frameNo );
        
        }
    
    }

});




/*
 * TODO
 * ====
 *
 * - move renderPrio flag and childrenUpdated event one-level up to Node (is Scene)
 * - rename app.root -> app.scene
 * - node.isReady/setReadyFunc() function (as extension to node.ready attribute)
 *
 */



/*
app.loadTextureAtlas( './nobinger.json' ).then( function ( atlas ) {

    console.debug( "loaded TextureAtlas", atlas );

    var spriteGroup = app.root.addChild( new Picimo.sg.SpriteGroup( app, { textureAtlas: atlas } ) );

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

