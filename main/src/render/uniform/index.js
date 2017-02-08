/* jshint esversion:6 */
import { definePropertiesPublicRO } from '../../utils/obj_props';
import addShaderValue from '../add_shader_value';
import addTexUnitProperties from './add_tex_unit_properties';

export default class Uniform {

    constructor ( program, info ) {

        definePropertiesPublicRO( this, {

            program  : program,
            info     : info,
            location : program.glx.gl.getUniformLocation( program.glProgram, info.name )

        });

        addShaderValue( this );
        addTexUnitProperties( this );

        Object.seal( this );

    }

    upload ( gl ) {

        if ( this.isSampler2d ) {

            this.texUnit = this.value.upload().bind();

        }

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
                gl.uniform1i( this.location, this.texUnit );
                break;

        }

        this.valueChanged = false;

    }

}

