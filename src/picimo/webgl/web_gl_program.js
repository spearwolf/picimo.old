(function () {
    "use strict";

    var Uniform = require( './uniform' );
    var Attrib  = require( './attrib' );


    function WebGlProgram ( program, glProgram, glx ) {

        this.program   = program;
        this.glProgram = glProgram;
        this.glx       = glx;

        setupUniformsAndAttributes( this );

        Object.freeze( this );

    }

    WebGlProgram.prototype.use = function () {

        if ( this.glx.activeProgram !== this ) {

            this.glx.activeProgram = this;
            this.glx.gl.useProgram( this.glProgram );

        }

    };


    function setupUniformsAndAttributes ( glProgram ) {

        var gl = glProgram.glx.gl;
        var numUniforms = gl.getProgramParameter( glProgram.glProgram, gl.ACTIVE_UNIFORMS );

        glProgram.uniformNames = [];
        glProgram.uniform = {};

        var i, uniform;

        for ( i = 0; i < numUniforms ; ++i ) {

            uniform = gl.getActiveUniform( glProgram.glProgram, i );

            glProgram.uniform[ uniform.name ] = new Uniform( glProgram, uniform );
            glProgram.uniformNames.push( uniform.name );

        }

        Object.freeze( glProgram.uniform );


        var numAttribs = gl.getProgramParameter( glProgram.glProgram, gl.ACTIVE_ATTRIBUTES );

        glProgram.attribNames = [];
        glProgram.attrib = {};

        var attr;

        for ( i = 0; i < numAttribs ; ++i ) {

            attr = gl.getActiveAttrib( glProgram.glProgram, i );

            glProgram.attrib[ attr.name ] = new Attrib( glProgram, attr );
            glProgram.attribNames.push( attr.name );

        }

        Object.freeze( glProgram.attrib );

    }


    module.exports = WebGlProgram;

})();
