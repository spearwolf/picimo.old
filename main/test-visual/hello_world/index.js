/* jshint browser:true */
/* global Picimo */

const app = new Picimo.App({

    canvas  : document.getElementById( 'picimo' ),
    alpha   : true,
    bgColor : '#a0c0e0'

});

// Set pixel resolution
app.scene.setSize( (96+16)*2, 96, 'contain' );

app.scene.appendPicture('/assets/images/spw-mini-logo.png', {  // test-76x12.png', {
    name       : 'spw',
    sceneFit   : 'contain',
    scale      : 0.8,
    renderPrio : -10,
    opacity    : 0.9
});

app.scene
    .appendScene({
        width      : 200,
        height     : 200,
        sizeFit    : 'contain',
        projection : true,
        renderPrio : -20
    })
    .appendPicture('bruce-lee.png', {  // test-76x12.png', {
        name: 'bruceLee',
        displayPosition: {
            bottom : 0,
            left   : '300iw',
            zoom   : 1
        }
    });

app.scene.appendSpriteGroup( app.loadTextureAtlas( '/assets/images/atlas/lab-walls-tiles.json' ), {

    capacity: 20,
    sprites: 'simple'

}, {

    init: function (done, sprites) {

        sprites.setDefaultSpriteSize( 32, 32 );

        sprites.createSprites([
            'numbers32_01', 0, 0,
            'numbers32_02', 32, 0,
            'numbers32_03', 32, -32,
            'numbers32_04', 64, 32,
            'numbers32_05', 64, 0,
            'numbers32_06', 64, -32,
            'numbers32_07', -64, 0,
            'numbers32_08', -96, -32,
            'numbers32_09', -96, 0,
            'numbers32_10', -96, 32,
        ]);

    }

});

