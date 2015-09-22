(function(){
    "use strict";

    var utils = require( '../../utils' );
    var WebGlBuffer = require( '../web_gl_buffer' );
    var VertexIndexArray = require( '../../core/vertex_index_array.js' );

    /**
     * @class Picimo.webgl.pipeline.SpriteGroupPipeline
     *
     * @description
     *
     *   TODO
     *     - update strategy ( all-at-once, blocks, ..? )
     *     
     */

    function SpriteGroupPipeline ( app, program, pool ) {

        this.app          = app;
        this.program      = program;
        this.spritePool   = pool;
        this.voDescriptor = pool.descriptor;
        this.capacity     = pool.capacity;

        reset( this );

        // TODO
        // - texture(s)

        this.webGlBuffer  = null;
        this.renderCmdObj = null;

    }


    SpriteGroupPipeline.prototype.initGl = function () {

        var self = this;

        if ( ! this.webGlBuffer ) {

            this.webGlBuffer = WebGlBuffer.fromVertexArray( this.app.glx, this.voDescriptor, {

                drawType    : this.app.gl.DYNAMIC_DRAW,  // TODO chosse vertex buffer type (static,dynamic or stream?)
                vertexArray : this.spritePool.vertexArray

            });

            this.indexArray = VertexIndexArray.Generate( this.capacity, [ 0,1,2, 0,2,3 ] );
            this.webGlIndexBuffer = WebGlBuffer.fromVertexIndexArray( this.app.glx, this.indexArray );

        }

        if ( ! this.renderCmdObj ) {

            this.renderCmdObj = new utils.ObjectPool( function () {

                var obj = {
                    program      : self.program,
                    uniforms     : null,
                    attributes   : null,
                    drawElements : {
                        buffer      : self.vertexIndexBuffer,
                        elementType : self.app.gl.TRIANGLES
                    }
                };

                // TODO
                //for attr in @program.attributeNames
                    //obj.attributes[attr] = @vertexBuffer

                // TODO
                //obj.drawElements.buffer      = @vertexIndexBuffer
                //obj.drawElements.elementType = gl.TRIANGLES

                Object.seal( obj );

                return obj;

            });

        }

    };


    function reset( pipeline ) {

        //pipeline.currentSpriteCount  = 0;
        //pipeline.currentSpriteOffset = 0;
        pipeline.totalSpritesCount   = 0;
        //pipeline.texture             = null;
        //pipeline.currentProgram      = null;

        if ( pipeline.renderCmdObj ) pipeline.renderCmdObj.releaseAll();

    }


    module.exports = SpriteGroupPipeline;

})();
