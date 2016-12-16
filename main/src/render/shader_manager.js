import Program from './program';
import ShaderSource from './shader_source';
import { definePropertiesPrivateRO } from '../utils/object_utils';

//===================================================================
//
// ShaderManager
//
//====================================================================

export default function ShaderManager ( app ) {

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

ShaderManager.prototype.addProgram = function ( name, vertexShaderName, fragmentShaderName ) {

    this.programs.set( name, new Program( name, vertexShaderName, fragmentShaderName ) );

    return this;

};


//-----------------------------------------------
//
// getProgram ( name ) -> render.Program
//
//----------------------------------------------------

ShaderManager.prototype.getProgram = function ( name ) {

    return this.programs.get( name );

};


//---------------------------------------------------------------
//
// addShader ( shader: render.ShaderSource ) -> shaderManager
//
//------------------------------------------------------------------

ShaderManager.prototype.addShader = function ( shader ) {

    if ( shader.shaderType === ShaderSource.VERTEX_SHADER ) {

        this.vertexShaders.set( shader.name, shader );

    } else if ( shader.shaderType === ShaderSource.FRAGMENT_SHADER ) {

        this.fragmentShaders.set( shader.name, shader );

    }

    return this;

};


//---------------------------------------------------------------------
//
// defineVertexShader ( name, source: string ) -> shaderManager
//
//------------------------------------------------------------------------

ShaderManager.prototype.defineVertexShader = function ( name, source ) {

    return this.addShader( new ShaderSource( this.app, ShaderSource.VERTEX_SHADER, name, source ) );

};


//---------------------------------------------------------------------
//
// defineFragmentShader ( name, source: string ) -> shaderManager
//
//------------------------------------------------------------------------

ShaderManager.prototype.defineFragmentShader = function ( name, source ) {

    return this.addShader( new ShaderSource( this.app, ShaderSource.FRAGMENT_SHADER, name, source ) );

};


//---------------------------------------------------------------------
//
// loadVertexShader ( name, url ) -> Promise<ShaderSource>
//
//------------------------------------------------------------------------

ShaderManager.prototype.loadVertexShader = function ( name, url ) {

    let source = new ShaderSource( this.app, ShaderSource.VERTEX_SHADER, name ).load( url );

    this.addShader( source );

    return source.promise;

};


//---------------------------------------------------------------------
//
// loadFragmentShader ( name, url ) -> Promise<ShaderSource>
//
//------------------------------------------------------------------------

ShaderManager.prototype.loadFragmentShader = function ( name, url ) {

    let source = new ShaderSource( this.app, ShaderSource.FRAGMENT_SHADER, name ).load( url );

    this.addShader( source );

    return source;

};


//---------------------------------------------------------------------
//
// getVertexShader ( name ) -> render.ShaderSource
//
//------------------------------------------------------------------------

ShaderManager.prototype.getVertexShader = function ( name ) {

    return this.vertexShaders.get( name );

};


//---------------------------------------------------------------------
//
// getFragmentShader ( name ) -> render.ShaderSource
//
//------------------------------------------------------------------------

ShaderManager.prototype.getFragmentShader = function ( name ) {

    return this.fragmentShaders.get( name );

};

