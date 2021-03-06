/* global Picimo */
/* global setTimeout */

var app = new Picimo.App({

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

window.spw = app.scene.findNode('spw');

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

// ========= nodes ============================================== {{{

var node = new Picimo.graph.Scene( app );

node.on( 'init', function ( done ) {

    console.log( 'init-ializing ..' );

    done( function ( resolve /*, reject */ ) {

        setTimeout( function () {

            console.log( '..done!' );
            resolve();
            // reject();

        }, 5000 );

    });

});

node.on( 'initGl', function ( done ) {

    console.log( 'initGl..' );

    done( new Promise( function ( resolve /*, reject */ ) {

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


// -------------------------------------------------------------- }}}
// ========= vertex objects ===================================== {{{

var vod = app.defineSprite('plah', {

    constructor: function Plah () {

        this.fooBar = 'plah!?';

    },

    vertexCount: 4,
    vertexAttrCount: 12,

    attributes: [

        { name: 'position',  size: 3, attrNames: [ 'x', 'y', 'z' ] },
        { name: 'rotate',    size: 1, uniform: true },
        { name: 'texCoords', size: 2, attrNames: [ 's', 't' ] },
        { name: 'translate', size: 2, uniform: true, attrNames: [ 'tx', 'ty' ] },
        { name: 'scale',     size: 1, uniform: true },
        { name: 'opacity',   size: 1, uniform: true }

    ],

    alias: {

        pos2d: { size: 2, offset: 0, uniform: true },
        posZ:  { size: 1, offset: 2, uniform: true },
        uv:    'texCoords'

    },

    proto: {
        numberOfBeast: function () {
            return 667;
        }
    }

});


var vo = vod.create();


console.log( "vod", vod );
console.log( "vo", vo );


// -------------------------------------------------------------- }}}
// ========= shaders ============================================ {{{

app.loadVertexShader( 'filmgrain', '/assets/shaders/filmgrain/shader.vert' );
app.loadFragmentShader( 'filmgrain', '/assets/shaders/filmgrain/shader.frag' );
app.addProgram( 'film', 'filmgrain', 'filmgrain' );

//gl_program = app.glx.glProgram( app.getProgram( 'film' ) );

// -------------------------------------------------------------- }}}

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

        //sprites.display = false;

    }

});


