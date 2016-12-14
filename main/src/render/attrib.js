'use strict';

import * as utils from '../utils';
import addShaderValue from './add_shader_value';

export default function Attrib ( program, info ) {

    utils.object.definePropertiesPublicRO( this, {

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

