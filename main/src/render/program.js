import WebGlProgram from './web_gl_program';
import { addUid } from '../utils';
import { definePropertiesPublicRO } from '../utils/object_utils';

export default function Program ( name, vertexShaderName, fragmentShaderName ) {

    addUid( this );

    definePropertiesPublicRO( this, {

        name               : name,
        vertexShaderName   : ( vertexShaderName ? vertexShaderName : name ),
        fragmentShaderName : ( fragmentShaderName ? fragmentShaderName : name ),

    });

}

Program.prototype.linkProgram = function ( app ) {

    const glx = app.glx;
    const gl = glx.gl;

    var vertexShader = glx.glShader( app.getVertexShader( this.vertexShaderName ) );
    if ( ! vertexShader ) return;

    var fragmentShader = glx.glShader( app.getFragmentShader( this.fragmentShaderName ) );
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

