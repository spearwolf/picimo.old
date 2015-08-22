(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.webgl.WebGlContext
     */

    function WebGlContext ( gl ) {

        if ( ! gl ) throw new Error( '[new Picimo.webgl.WebGlContext] gl is undefined!' );

        utils.object.definePropertyPublicRO( this, 'gl', gl );

        utils.object.definePropertiesPrivateRO( this, {
            '_boundBuffers' : new utils.Map(),
            '_boundTextures': new utils.Map(),
            '_shaders'      : new utils.Map(),
            '_programs'     : new utils.Map()
        });

        getExtensions( this );
        readWebGlParameters( this );

        this.app           = null;
        this.activeProgram = null;

        Object.seal( this );

    }

    /**
     * @method Picimo.webgl.WebGlContext#bindTexture
     * @param {number} textureType - gl.TEXTURE_2D or ..
     * @param texture
     */

    WebGlContext.prototype.bindTexture = function ( textureType, texture ) {

        if ( this._boundTextures.get( textureType ) !== texture ) {

            this._boundTextures.set( textureType, texture );
            this.gl.bindTexture( textureType, texture );

        }

    };

    /**
     * @method Picimo.webgl.WebGlContext#bindBuffer
     * @param {number} bufferType - gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER
     * @param buffer
     */

    WebGlContext.prototype.bindBuffer = function ( bufferType, buffer ) {

        if ( this._boundBuffers.get( bufferType ) !== buffer ) {

            this._boundBuffers.set( bufferType, buffer );
            this.gl.bindBuffer( bufferType, buffer );

        }

    };

    /**
     * @method Picimo.webgl.WebGlContext#bindArrayBuffer
     * @param buffer
     */

    WebGlContext.prototype.bindArrayBuffer = function ( buffer ) {

        this.bindBuffer( this.gl.ARRAY_BUFFER, buffer );

    };

    /**
     * @method Picimo.webgl.WebGlContext#bindElementArrayBuffer
     * @param buffer
     */

    WebGlContext.prototype.bindElementArrayBuffer = function ( buffer ) {

        this.bindBuffer( this.gl.ELEMENT_ARRAY_BUFFER, buffer );

    };

    /**
     * @method Picimo.webgl.WebGlContext#glShader
     * @param {Picimo.webgl.ShaderSource} shader
     * @return {WebGLShader} The shader object or *undefined*
     */

    WebGlContext.prototype.glShader = function ( shader ) {

        if ( shader === undefined ) return;

        var glShader = this._shaders.get( shader.uid );

        if ( glShader === undefined ) {

            glShader = shader.compile( this.gl );

            if ( glShader !== undefined ) {

                this._shaders.set( shader.uid, glShader );

            }

        }

        return glShader;

    };

    /**
     * @method Picimo.webgl.WebGlContext#glProgram
     * @param {Picimo.webgl.Program} program
     * @return {Picimo.webgl.WebGlProgram} The program object or *undefined*
     */

    WebGlContext.prototype.glProgram = function ( program ) {

        if ( program === undefined ) return;

        var glProgram = this._programs.get( program.uid );

        if ( glProgram === undefined ) {
        
            glProgram = program.linkProgram( this.app );

            if ( glProgram !== undefined ) {
            
                this._programs.set( program.uid, glProgram );
            
            }
        
        }

        return glProgram;

    };



    function readWebGlParameters( webGlContext ) {

        var gl = webGlContext.gl;

        utils.object.definePropertiesPublicRO( webGlContext, {

            /**
             * @member {number} Picimo.webgl.WebGlContext#MAX_TEXTURE_SIZE - gl.MAX_TEXTURE_SIZE
             */
            MAX_TEXTURE_SIZE : gl.getParameter( gl.MAX_TEXTURE_SIZE ),

            /**
             * @member {number} Picimo.webgl.WebGlContext#MAX_TEXTURE_IMAGE_UNITS - gl.MAX_TEXTURE_IMAGE_UNITS
             */
            MAX_TEXTURE_IMAGE_UNITS : gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS )

        });

    }

    function getExtensions( webGlContext ) {

        webGlContext.OES_element_index_uint = webGlContext.gl.getExtension("OES_element_index_uint");

        if ( ! webGlContext.OES_element_index_uint ) {

            console.error( "WebGL don't support the OES_element_index_uint extension!" );

        }

    }

    module.exports = WebGlContext;

})();
