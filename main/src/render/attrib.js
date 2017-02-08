/* jshint esversion:6 */
import addShaderValue from './add_shader_value';
import { definePropertiesPublicRO } from '../utils/obj_props';

export default class Attrib {

    constructor ( program, info ) {

        definePropertiesPublicRO( this, {

            program  : program,
            info     : info,
            location : program.glx.gl.getAttribLocation( program.glProgram, info.name )

        });

        program.glx.gl.enableVertexAttribArray( this.location );  // TODO understand why this is important and validate that this is the best location to call it

        addShaderValue( this );

        Object.seal( this );

    }

    upload () {  //} gl ) {

        if ( ! this.valueChanged ) return;

        let val = this.value;

        val.buffer.bindBuffer().vertexAttribPointer( this.location, val.size, val.stride, val.offset );

        this.valueChanged = false;

    }

}

