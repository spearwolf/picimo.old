(function () {
    'use strict';

    var utils = require( '../utils' );

    /**
     * @class Picimo.webgl.WebGlBuffer
     * @description
     * An object-orientated wrapper for the WebGL buffer api.
     *
     * @param {Picimo.webgl.WebGlContext} glx
     * @param {Object} options
     */

    function WebGlBuffer ( glx, options ) {

        var gl = glx.gl;

        utils.object.definePropertiesPrivateRO( this, {

            glx        : glx,
            glBuffer   : gl.createBuffer(),

            drawType   : ( options.drawType || gl.DYNAMIC_DRAW ),
            bufferType : ( options.bufferType || gl.ARRAY_BUFFER ),
            itemType   : ( options.itemType || ( this.bufferType === gl.ARRAY_BUFFER ? gl.FLOAT : gl.UNSIGNED_SHORT ) ),
            arrType    : ( options.arrType || ( this.itemType === gl.FLOAT ? Float32Array : Uint16Array ) ),

            itemSize   : options.itemSize,

        });

        this.numItems   = options.numItems || 0;
        this.dataArray  = options.dataArray;

        Object.seal( this );

    }

    /**
     * @method Picimo.webgl.WebGlBuffer#bindBuffer
     * @return self
     */

    WebGlBuffer.prototype.bindBuffer = function () {

        this.glx.bindBuffer( this.bufferType, this.glBuffer );
        return this;

    };

    /**
     * @method Picimo.webgl.WebGlBuffer#bufferData
     * @param arr
     * @return self
     */

    WebGlBuffer.prototype.bufferData = function ( arr ) {

        this.numItems = ( arr.length / this.itemSize ) | 0;
        this.dataArray = arr instanceof this.arrType ? arr : new this.arrType( arr );

        this.bindBuffer();
        this.glx.gl.bufferData( this.bufferType, this.dataArray, this.drawType );

        return this;

    };

    /**
     * @method Picimo.webgl.WebGlBuffer#bufferSubData
     * @param arr
     * @param {number} count
     * @param {number} [offset]
     * @return self
     */

    WebGlBuffer.prototype.bufferSubData = function ( arr, count, offset ) {

        this.bindBuffer();

        if ( ! arr ) arr = this.dataArray;

        if ( typeof count === 'number' ) {

            if ( offset === undefined ) offset = 0;

            arr = new this.arrType( arr.buffer, offset * this.arrType.BYTES_PER_ELEMENT, count );

        }

        this.glx.gl.bufferSubData( this.bufferType, 0, arr );

        return this;

    };

    /**
     * @method Picimo.webgl.WebGlBuffer#vertexAttribPointer
     * @param pointer
     * @param itemSize
     * @param stride
     * @param offset
     * @param normalized
     * @return self
     */

    WebGlBuffer.prototype.vertexAttribPointer = function ( pointer, itemSize, stride, offset, normalized ) {

        var gl = this.glx.gl;

        gl.vertexAttribPointer( pointer,
            ( itemSize || this.itemSize ),
            this.itemType,
            ( normalized ? gl.TRUE : gl.FALSE ),
            ( stride || 0 ) * this.arrType.BYTES_PER_ELEMENT,
            ( offset || 0 ) * this.arrType.BYTES_PER_ELEMENT );

        return this;

    };

    /**
     * @method Picimo.webgl.WebGlBuffer#drawElements
     * @param elemType
     * @param numItems
     * @param offset
     */

    WebGlBuffer.prototype.drawElements = function ( elemType, numItems, offset ) {

        var gl = this.glx.gl;

        gl.drawElements( ( elemType || gl.TRIANGLES ), ( numItems || this.numItems ), this.itemType, ( offset || 0 ) * this.arrType.BYTES_PER_ELEMENT );

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

    /**
     * Returns a new WebGlBuffer.
     * @memberof Picimo.webgl.WebGlBuffer
     * @method fromVertexArray
     * @param {Picimo.webgl.WebGlContext} glx
     * @param {Picimo.core.VertexArrayDescriptor} descriptor
     * @param {Object} options
     * @static
     */

    WebGlBuffer.fromVertexArray = function ( glx, descriptor, options ) {

        var opts = {

            drawType   : ( options && options.drawType ? options.drawType : glx.gl.DYNAMIC_DRAW ),
            bufferType : glx.gl.ARRAY_BUFFER,
            itemType   : glx.gl.FLOAT,
            arrType    : Float32Array,
            itemSize   : descriptor.vertexAttrCount,

        };

        var buffer = new WebGlBuffer( glx, opts );

        if ( options && options.vertexArray ) {

            buffer.bufferData( options.vertexArray.vertices );

        }

        return buffer;

    };

    /**
     * Returns a new WebGlBuffer.
     * @memberof Picimo.webgl.WebGlBuffer
     * @method fromVertexIndexArray
     * @param {Picimo.webgl.WebGlContext} glx
     * @param {Picimo.core.VertexIndexArray} vertexIndexArray
     * @static
     */

    WebGlBuffer.fromVertexIndexArray = function ( glx, vertexIndexArray ) {

        var opts = {

            drawType   : glx.gl.STATIC_DRAW,
            bufferType : glx.gl.ELEMENT_ARRAY_BUFFER,
            itemType   : glx.gl.UNSIGNED_SHORT,
            arrType    : Uint16Array,
            itemSize   : vertexIndexArray.objectIndexCount,
            numItems   : vertexIndexArray.vertexObjectCount,

        };

        var buffer = new WebGlBuffer( glx, opts );
        buffer.bufferData( vertexIndexArray.indices );

        return buffer;

    };


    module.exports = WebGlBuffer;

})();
