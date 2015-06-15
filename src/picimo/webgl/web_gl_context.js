(function(){
    "use strict";

    var Map = require( 'core-js/library/fn/map' );

    /**
     * @class Picimo.webgl.WebGlContext
     */

    function WebGlContext ( gl ) {

        if ( ! gl ) throw new Error( '[new Picimo.webgl.WebGlContext] gl is undefined!' );

        Object.defineProperty( this, 'gl', { value: gl, enumerable: true } );

        clearCaches( this );
        readWebGlParameters( this );

    }

    WebGlContext.prototype.glBindBuffer = function ( bufferType, buffer ) {

        if ( this._boundBuffers.get( bufferType ) !== buffer ) {

            this._boundBuffers.set( bufferType, buffer );
            this.gl.bindBuffer( bufferType, buffer );

        }

    };

    function clearCaches ( webGlContext ) {

        webGlContext._boundBuffers  = new Map();
        webGlContext._boundTextures = new Map();

    }

    function readWebGlParameters( webGlContext ) {

        var gl = webGlContext.gl;

        Object.defineProperties( webGlContext, {

            MAX_TEXTURE_SIZE: {
                value: gl.getParameter( webGlContext.gl.MAX_TEXTURE_SIZE ),
                enumerable: true
            },

            MAX_TEXTURE_IMAGE_UNITS: {
                value: gl.getParameter( webGlContext.gl.MAX_TEXTURE_IMAGE_UNITS ),
                enumerable: true
            }

        });

    }

    module.exports = WebGlContext;

})();
