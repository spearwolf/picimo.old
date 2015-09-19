/* global Uint16Array */
/* global Float32Array */
(function(){
    'use strict';

    /**
     * @class Picimo.webgl.WebGlBuffer
     *
     * @param {Picimo.webgl.WebGlContext} glx
     *
     */

    function WebGlBuffer ( glx, options ) {

        this.glx = glx;

        var gl = glx.gl;

        this.glBuffer = gl.createBuffer();

        this.drawType   = options.drawType   || gl.DYNAMIC_DRAW;
        this.bufferType = options.bufferType || gl.ARRAY_BUFFER;
        this.itemType   = options.itemType   || ( this.bufferType === gl.ARRAY_BUFFER ? gl.FLOAT : gl.UNSIGNED_SHORT );
        this.arrType    = options.arrType    || ( this.itemType === gl.FLOAT ? Float32Array : Uint16Array );

        this.itemSize   = options.itemSize;
        this.numItems   = options.numItems || 0;

    }

    /**
     * @method Picimo.webgl.WebGlBuffer#bindBuffer
     */

    WebGlBuffer.prototype.bindBuffer = function () {

        this.glx.bindBuffer( this.bufferType, this.glBuffer );
        return this;

    };

    /**
     * @method Picimo.webgl.WebGlBuffer#bufferData
     * @param arr
     */

    WebGlBuffer.prototype.bufferData = function ( arr ) {

        this.numItems = ( arr.length / this.itemSize ) | 0;

        this.bindBuffer();
        this.glx.gl.bufferData( this.bufferType, arr, this.drawType );

        return this;

    };

    /**
     * @method Picimo.webgl.WebGlBuffer#destroy
     */

    WebGlBuffer.prototype.destroy = function () {

        if ( this.glx ) {
        
            if ( this.glBuffer ) {
            
                this.glx.gl.deleteBuffer( this.glBuffer );
                this.glBuffer = null;
            
            }

            this.glx = null;

        }
    
    };

    WebGlBuffer.fromVertexObjectDescriptor = function ( voDescriptor ) {

        // TODO
    
    };

    module.exports = WebGlBuffer;

})();
