(function(){
    "use strict";

    var utils        = require( '../utils' );
    var WebGlProgram = require( './web_gl_program' );

    function Program ( name, vertexShaderName, fragmentShaderName ) {
        
        utils.addUid( this );

        utils.object.definePropertiesPublicRO( this, {

            name               : name,
            vertexShaderName   : ( vertexShaderName ? vertexShaderName : name ),
            fragmentShaderName : ( fragmentShaderName ? fragmentShaderName : name ),

        });

    }

    Program.prototype.linkProgram = function ( app ) {

        var glx = app.glx;
        var gl = glx.gl;

        var vertexShader = glx.glShader( app.shader.getVertexShader( this.vertexShaderName ) );
        if ( ! vertexShader ) return;

        var fragmentShader = glx.glShader( app.shader.getFragmentShader( this.fragmentShaderName ) );
        if ( ! fragmentShader ) return;

        var gl_program = gl.createProgram();

        gl.attachShader( gl_program, vertexShader );
        gl.attachShader( gl_program, fragmentShader );

        gl.linkProgram( gl_program );

        if ( ! gl.getProgramParameter( gl_program, gl.LINK_STATUS ) ) {

            throw new Error( "Could not link webgl program: " + this.name );
        
        }

        return new WebGlProgram( this, gl_program, glx );

    };


    module.exports = Program;

})();
