(function(){
    "use strict";

    //var utils = require( '../utils' );

    function WebGlProgram ( program, glProgram, glx ) {

        this.program   = program;
        this.glProgram = glProgram;
        this.glx       = glx;
        
        setupUniformsAndAttributes( this );

        Object.freeze( this );

    }

    WebGlProgram.prototype.use = function ( glx ) {

        if ( glx.activeProgram !== this ) {

            glx.activeProgram = this;
            glx.gl.useProgram( this.glProgram );
        
        }
    
    };


    function setupUniformsAndAttributes ( glProgram ) {
    
        var gl          = glProgram.glx.gl;
        var numUniforms = gl.getProgramParameter( glProgram.glProgram, gl.ACTIVE_UNIFORMS );

        glProgram.activeUniforms = [];
        glProgram.uniformNames   = [];

        var i, uniform;

        for ( i = 0; i < numUniforms ; ++i ) {

            uniform = gl.getActiveUniform( glProgram.glProgram, i );

            glProgram.activeUniforms.push( uniform );
            glProgram.uniformNames.push( uniform.name );
        
        }

        // TODO setup uniform and attribute locations
    
    }


    module.exports = WebGlProgram;

})();
