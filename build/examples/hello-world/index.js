/* global Picimo */
/* global setTimeout */

var app  = new Picimo.App({

    canvas  : document.getElementById( 'picimo' ),
    alpha   : true,
    bgColor : '#a0c0e0'

});

// Set pixel resolution
app.scene.setSize( (96+16)*2, 96, 'contain' );

app.loadVertexShader('picture', '/assets/shaders/complex-sprite/complex-sprite.vert');
app.loadFragmentShader('picture', '/assets/shaders/complex-sprite/complex-sprite.frag');
app.addProgram('picture', 'picture', 'picture');

app.scene.appendPicture('/assets/images/test-76x12.png', {  // spw-mini-logo.png', {
    name: 'spw',
    displaySize: 'contain',
    renderPrio: -10,
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

app.loadVertexShader( 'sprite', '/assets/shaders/sprite/shader.vert' );
app.loadFragmentShader( 'sprite', '/assets/shaders/sprite/shader.frag' );
app.addProgram( 'sprite', 'sprite', 'sprite' );

app.scene.appendGroup().appendSpriteGroup( app.loadTextureAtlas( '/assets/images/atlas/lab-walls-tiles.json' ), {

    capacity: 20,
    sprites: 'simple'

}, {

    init: function (done, sprites) {

        sprites.setDefaultSpriteSize( 32, 32 );

        sprites.createSprite('numbers32_01').setTranslate( 0, 0 );
        sprites.createSprite('numbers32_02').setTranslate( 32, 0 );
        sprites.createSprite('numbers32_03').setTranslate( 32, -32 );
        sprites.createSprite('numbers32_04').setTranslate( 64, 32 );
        sprites.createSprite('numbers32_05').setTranslate( 64, 0 );
        sprites.createSprite('numbers32_06').setTranslate( 64, -32 );
        sprites.createSprite('numbers32_07').setTranslate( -64, 0 );
        sprites.createSprite('numbers32_08').setTranslate( -96, -32 );
        sprites.createSprite('numbers32_09').setTranslate( -96, 0 );
        sprites.createSprite('numbers32_10').setTranslate( -96, 32 );
        //sprites.createSprite('numbers32_10').setTranslate( 76-32, 0 );

        //sprites.display = false;

    }

});

