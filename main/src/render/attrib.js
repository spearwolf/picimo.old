import addShaderValue from './add_shader_value';
import { definePropertiesPublicRO } from '../utils/object_utils';

export default function Attrib ( program, info ) {

    definePropertiesPublicRO( this, {

        program  : program,
        info     : info,
        location : program.glx.gl.getAttribLocation( program.glProgram, info.name )

    });

    program.glx.gl.enableVertexAttribArray( this.location );  // TODO understand why this is important and validate that this is the best location to call it

    addShaderValue( this );

    Object.seal( this );

}

Attrib.prototype.upload = function () {  //} gl ) {

    if ( ! this.valueChanged ) return;

    let val = this.value;

    val.buffer.bindBuffer().vertexAttribPointer( this.location, val.size, val.stride, val.offset );

    this.valueChanged = false;

};

