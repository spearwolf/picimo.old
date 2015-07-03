/* global Picimo */

var app  = new Picimo.App({
    
    appendTo : document.getElementById( 'picimo' ),
    alpha    : true

});

// ========= nodes ============================================== {{{

var node = new Picimo.sg.Node( app );

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


// -------------------------------------------------------------- }}}
// ========= vertex objects ===================================== {{{

var vod = new Picimo.core.VertexObjectDescriptor(

    function () {

        this.fooBar = 'plah!?';

    },

    4,
    12,

    [

        { name: 'position',  size: 3, attrNames: [ 'x', 'y', 'z' ] },
        { name: 'rotate',    size: 1, uniform: true },
        { name: 'texCoords', size: 2, attrNames: [ 's', 't' ] },
        { name: 'translate', size: 2, uniform: true, attrNames: [ 'tx', 'ty' ] },
        { name: 'scale',     size: 1, uniform: true },
        { name: 'opacity',   size: 1, uniform: true }

    ],

    {

        pos2d: { size: 2, offset: 0 },
        posZ:  { size: 1, offset: 2, uniform: true },
        uv:    'texCoords'

    }

);

vod.proto.numberOfBeast = function () {

    return 666;

};

var vo = vod.create();


console.log( "vod", vod );
console.log( "vo", vo );


// -------------------------------------------------------------- }}}
// ========= shaders ============================================ {{{

app.shader.loadVertexShader( 'filmgrain', '/assets/shaders/filmgrain/shader.vert' );
app.shader.loadFragmentShader( 'filmgrain', '/assets/shaders/filmgrain/shader.frag' );
app.shader.addProgram( 'film', 'filmgrain', 'filmgrain' );

//gl_program = app.glx.glProgram( app.shader.getProgram( 'film' ) );

// -------------------------------------------------------------- }}}

