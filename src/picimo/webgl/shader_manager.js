(function(){
    "use strict";

    var utils        = require( '../utils' );
    var ShaderSource = require( './shader_source' );
    var Program      = require( './program' );

    /**
     * @class Picimo.webgl.ShaderManager
     */

    function ShaderManager ( app ) {
        
        utils.object.definePropertyPublicRO( this, 'app', app );

        utils.object.definePropertiesPrivateRO( this, {

            _vertexShader   : new utils.Map(),
            _fragmentShader : new utils.Map(),
            _programs       : new utils.Map(),
        
        });

    }


    /**
     * @method Picimo.webgl.ShaderManager#addProgram
     * @param {string} name
     * @param {string} [vertexShaderName=name]
     * @param {string} [fragmentShaderName=name]
     * @return {Picimo.webgl.ShaderManager} self
     */

    ShaderManager.prototype.addProgram = function ( name, vertexShaderName, fragmentShaderName ) {

        this._programs.set( name, new Program( name, vertexShaderName, fragmentShaderName ) );

        return this;
    
    };


    /**
     * @method Picimo.webgl.ShaderManager#getProgram
     * @param {string} name
     * @return {Picimo.webgl.Program} program
     */

    ShaderManager.prototype.getProgram = function ( name ) {

        return this._programs.get( name );
    
    };


    /**
     * @method Picimo.webgl.ShaderManager#addShader
     * @param {Picimo.webgl.ShaderSource} shader
     * @return {Picimo.webgl.ShaderManager} self
     */

    ShaderManager.prototype.addShader = function ( shader ) {

        if ( shader.shaderType === ShaderSource.VERTEX_SHADER ) {
        
            this._vertexShader.set( shader.name, shader );
        
        } else if ( shader.shaderType === ShaderSource.FRAGMENT_SHADER ) {
        
            this._fragmentShader.set( shader.name, shader );

        }

        return this;
    
    };


    /**
     * @method Picimo.webgl.ShaderManager#addVertexShader
     * @param {string} name
     * @param {string} shader - The raw shader source string
     * @return {Picimo.webgl.ShaderManager} self
     */

    ShaderManager.prototype.addVertexShader = function ( name, source ) {

        return this.addShader( new ShaderSource( ShaderSource.VERTEX_SHADER, name, source ) );

    };


    /**
     * @method Picimo.webgl.ShaderManager#addFragmentShader
     * @param {string} name
     * @param {string} shader - The raw shader source string
     * @return {Picimo.webgl.ShaderManager} self
     */

    ShaderManager.prototype.addFragmentShader = function ( name, source ) {

        return this.addShader( new ShaderSource( ShaderSource.FRAGMENT_SHADER, name, source ) );

    };


    /**
     * @method Picimo.webgl.ShaderManager#loadVertexShader
     * @param {string} name
     * @param {string} url
     * @return {Picimo.webgl.ShaderManager} self
     */

    ShaderManager.prototype.loadVertexShader = function ( name, url ) {

        return this.addShader( new ShaderSource( ShaderSource.VERTEX_SHADER, name ).load( url ) );

    };


    /**
     * @method Picimo.webgl.ShaderManager#loadFragmentShader
     * @param {string} name
     * @param {string} url
     * @return {Picimo.webgl.ShaderManager} self
     */

    ShaderManager.prototype.loadFragmentShader = function ( name, url ) {

        return this.addShader( new ShaderSource( ShaderSource.FRAGMENT_SHADER, name ).load( url ) );

    };


    /**
     * @method Picimo.webgl.ShaderManager#getVertexShader
     * @param {string} name
     * @return {Picimo.webgl.ShaderSource} shader
     */

    ShaderManager.prototype.getVertexShader = function ( name ) {

        return this._vertexShader.get( name );
    
    };


    /**
     * @method Picimo.webgl.ShaderManager#getFragmentShader
     * @param {string} name
     * @return {Picimo.webgl.ShaderSource} shader
     */

    ShaderManager.prototype.getFragmentShader = function ( name ) {

        return this._fragmentShader.get( name );
    
    };


    module.exports = ShaderManager;

})();