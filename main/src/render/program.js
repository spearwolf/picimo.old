/* jshint esversion:6 */
import WebGlProgram from './web_gl_program';
import addUid from '../utils/add_uid';
import { definePropertiesPublicRO } from '../utils/obj_props';

export default class Program {

    constructor ( name, vertexShaderName, fragmentShaderName ) {

        addUid( this );

        definePropertiesPublicRO( this, {

            name               : name,
            vertexShaderName   : ( vertexShaderName ? vertexShaderName : name ),
            fragmentShaderName : ( fragmentShaderName ? fragmentShaderName : name ),

        });

    }

    linkProgram ( app ) {

        const glx = app.glx;
        const gl = glx.gl;

        const vertexShader = glx.glShader( app.getVertexShader( this.vertexShaderName ) );
        if ( ! vertexShader ) return;

        const fragmentShader = glx.glShader( app.getFragmentShader( this.fragmentShaderName ) );
        if ( ! fragmentShader ) return;

        const gl_program = gl.createProgram();

        gl.attachShader( gl_program, vertexShader );
        gl.attachShader( gl_program, fragmentShader );

        gl.linkProgram( gl_program );

        if ( ! gl.getProgramParameter( gl_program, gl.LINK_STATUS ) ) {

            throw new Error( "Could not link webgl program: " + this.name );

        }

        return new WebGlProgram( this, gl_program, glx );

    }

}

