/* jshint esversion:6 */
/* jshint -W058 */
import Program from './program';
import ShaderSource from './shader_source';
import { definePropertiesPrivateRO } from '../utils/obj_props';

//===================================================================
//
// ShaderManager
//
//====================================================================

export default class ShaderManager {

    constructor ( app ) {

        definePropertiesPrivateRO( this, {

            app : app,

            vertexShaders   : new Map,
            fragmentShaders : new Map,
            programs        : new Map,

        });

    }

    //---------------------------------------------------------------------------------------------------
    //
    // addProgram ( name [, vertexShaderName = name ] [, fragmentShaderName = name ] ) -> shaderManager
    //
    //--------------------------------------------------------------------------------------------------------

    addProgram ( name, vertexShaderName, fragmentShaderName ) {

        this.programs.set( name, new Program( name, vertexShaderName, fragmentShaderName ) );

        return this;

    }


    //-----------------------------------------------
    //
    // getProgram ( name ) -> render.Program
    //
    //----------------------------------------------------

    getProgram ( name ) {

        return this.programs.get( name );

    }


    //---------------------------------------------------------------
    //
    // addShader ( shader: render.ShaderSource ) -> shaderManager
    //
    //------------------------------------------------------------------

    addShader ( shader ) {

        if ( shader.shaderType === ShaderSource.VERTEX_SHADER ) {

            this.vertexShaders.set( shader.name, shader );

        } else if ( shader.shaderType === ShaderSource.FRAGMENT_SHADER ) {

            this.fragmentShaders.set( shader.name, shader );

        }

        return this;

    }


    //---------------------------------------------------------------------
    //
    // defineVertexShader ( name, source: string ) -> shaderManager
    //
    //------------------------------------------------------------------------

    defineVertexShader ( name, source ) {

        return this.addShader( new ShaderSource( this.app, ShaderSource.VERTEX_SHADER, name, source ) );

    }


    //---------------------------------------------------------------------
    //
    // defineFragmentShader ( name, source: string ) -> shaderManager
    //
    //------------------------------------------------------------------------

    defineFragmentShader ( name, source ) {

        return this.addShader( new ShaderSource( this.app, ShaderSource.FRAGMENT_SHADER, name, source ) );

    }


    //---------------------------------------------------------------------
    //
    // loadVertexShader ( name, url ) -> Promise<ShaderSource>
    //
    //------------------------------------------------------------------------

    loadVertexShader ( name, url ) {

        let source = new ShaderSource( this.app, ShaderSource.VERTEX_SHADER, name ).load( url );

        this.addShader( source );

        return source.promise;

    }


    //---------------------------------------------------------------------
    //
    // loadFragmentShader ( name, url ) -> Promise<ShaderSource>
    //
    //------------------------------------------------------------------------

    loadFragmentShader ( name, url ) {

        let source = new ShaderSource( this.app, ShaderSource.FRAGMENT_SHADER, name ).load( url );

        this.addShader( source );

        return source;

    }


    //---------------------------------------------------------------------
    //
    // getVertexShader ( name ) -> render.ShaderSource
    //
    //------------------------------------------------------------------------

    getVertexShader ( name ) {

        return this.vertexShaders.get( name );

    }


    //---------------------------------------------------------------------
    //
    // getFragmentShader ( name ) -> render.ShaderSource
    //
    //------------------------------------------------------------------------

    getFragmentShader ( name ) {

        return this.fragmentShaders.get( name );

    }

}

