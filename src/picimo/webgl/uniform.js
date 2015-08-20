(function(){
    "use strict";

    var utils          = require( '../utils' );
    var addShaderValue = require( './add_shader_value' );

    function Uniform ( program, info ) {

        utils.object.definePropertiesPublicRO( this, {

            program  : program,
            info     : info,
            location : program.glx.gl.getUniformLocation( program.glProgram, info.name )

        });

        addShaderValue( this );

        Object.seal( this );

    }


    Uniform.prototype.upload = function ( gl ) {

        if ( ! this.valueChanged ) return;

        switch ( this.info.type ) {

            case gl.FLOAT:
                gl.uniform1f( this.location, this.value );
                break;

            case gl.FLOAT_VEC2:
                gl.uniform2f( this.location, this.value[ 0 ], this.value[ 1 ] );
                break;

            case gl.FLOAT_VEC3:
                gl.uniform3f( this.location, this.value[ 0 ], this.value[ 1 ], this.value[ 2 ] );
                break;

            case gl.FLOAT_VEC4:
                gl.uniform4f( this.location, this.value[ 0 ], this.value[ 1 ], this.value[ 2 ], this.value[ 3 ] );
                break;

            case gl.FLOAT_MAT4:
                gl.uniformMatrix4fv( this.location, gl.FALSE, this.value.mat4 );
                break;

            case gl.SAMPLER_2D:
                gl.uniform1i( this.location, /* TODO texture-unit */ 0 );
                break;

        }

        this.valueChanged = false;

    };


    module.exports = Uniform;

})();
