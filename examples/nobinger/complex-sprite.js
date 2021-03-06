/* global Picimo */

console.log( 'welcome to the %c %cnobinger%c benchmark v1 %c%c a picimo demo! ', 'background-color:yellow', 'font-style:italic;background-color:yellow', 'font-style:normal;background-color:yellow', 'background-color:transparent', 'background-color:red;color:#fff' );

// Setup
//
var app = new Picimo.App({

    canvas : document.getElementById( 'picimo' ),
    alpha  : true,

});

// Set pixel resolution
//
app.scene.setSize( 800, 600, "contain" );

// Load texture atlas
//
var atlas = app.loadTextureAtlas( './nobinger.json' );
var amigaballs = app.loadTextureAtlas( '/assets/images/atlas/amigaballs/amigaballs.json' );

// Define custom sprite shader
//
app.shader.loadVertexShader( 'complex-sprite', '/assets/shaders/complex-sprite/complex-sprite.vert' );
app.shader.loadFragmentShader( 'complex-sprite', '/assets/shaders/complex-sprite/complex-sprite.frag' );
app.shader.addProgram( 'complex-sprite', 'complex-sprite', 'complex-sprite' );

// Define a custom sprite class
//
var myCustomSpriteDescriptor = new Picimo.core.VertexObjectDescriptor(

    function () {

        this.setAnchor( 0, 0 );  // anchor
        this.setRgb( 1, 1, 1 );

    },

    4, 16,

    [
        { name: 'xwyh',      size: 2, attrNames: [ 'xw', 'yh' ] },
        { name: 'size',      size: 2, attrNames: [ 'width', 'height' ], uniform: true },
        { name: 'scale',     size: 2, attrNames: [ 'sx', 'sy' ], uniform: true },
        { name: 'pos',       size: 2, attrNames: [ 'x', 'y' ], uniform: true },
        { name: 'texCoords', size: 2, attrNames: [ 's', 't' ] },
        { name: 'rotate',    size: 1, uniform: true },
        { name: 'texUnit',   size: 1, uniform: true },
        { name: 'rgb',       size: 3, attrNames: [ 'r', 'g', 'b' ], uniform: true },
        { name: 'opacity',   size: 1, uniform: true },

    ], {
        // both are referenced by our shader

        'rot_texUnit' : { size: 2, offset: 10, uniform: true },
        'color'       : { size: 4, offset: 12, uniform: true },

    });


myCustomSpriteDescriptor.proto.setAnchor = function ( x, y ) {

    this.setXwyh( -0.5 - x, 0.5 - y, 0.5 - x, 0.5 - y, 0.5 - x, -0.5 - y, -0.5 - x, -0.5 - y );

};


// Create a fantastic scene
//
var balls = app.scene.appendSpriteGroup( amigaballs, {

        capacity         : 50,
        program          : 'complex-sprite',
        spriteDescriptor : myCustomSpriteDescriptor,
        defaultWidth     : 24,
        defaultHeight    : 24,

    }, {

        init: function () {

            var i;

            for ( i = 0; i < 25; i++ ) balls.createSprite().setPos( i * 25, -64 );
            for ( i = 1; i < 25; i++ ) balls.createSprite().setPos( -i * 25, -64 );

        },

    });

var spriteGroup = app.scene.appendSpriteGroup( atlas, {

        capacity         : 10,
        program          : 'complex-sprite',
        spriteDescriptor : myCustomSpriteDescriptor,
        defaultWidth     : 100,
        defaultHeight    : 100,

    }, {

        init: function () {

            var s = spriteGroup.createSprite();

            spriteGroup.createSprite().setPos( 200, 0 );
            spriteGroup.createSprite().setPos( 400, 0 );
            spriteGroup.createSprite().setPos( -200, 0 );
            spriteGroup.createSprite().setPos( -400, 0 );

            window.mySprite = s;

        },

    });
