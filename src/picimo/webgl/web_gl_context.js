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
            '_boundTextures': new utils.Map()
        });

        getExtensions( this );
        readWebGlParameters( this );

        Object.seal( this );

    }

    /**
     * @method Picimo.webgl.WebGlContext#glBindBuffer
     * @param bufferType
     * @param buffer
     */

    WebGlContext.prototype.glBindBuffer = function ( bufferType, buffer ) {

        if ( this._boundBuffers.get( bufferType ) !== buffer ) {

            this._boundBuffers.set( bufferType, buffer );
            this.gl.bindBuffer( bufferType, buffer );

        }

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
