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

        utils.object.definePropertiesPrivateRO( this, {

            app     : app,
            program : program,
            pool    : pool,
        
        });

        reset( this );

        // TODO
        // - texture(s)

        this.indexArray       = null;
        this.webGlBuffer      = null;
        this.webGlIndexBuffer = null;
        this.renderCmdObj     = null;

        Object.seal( this );

    }


    SpriteGroupPipeline.prototype.initGl = function () {

        initBuffers( this );
        initRenderCmds( this );

    };


    SpriteGroupPipeline.prototype.render = function () {

        // TODO render whole vertex array (-> render command)

    };


    function initBuffers ( self ) {

        if ( ! self.webGlBuffer ) {

            self.webGlBuffer = WebGlBuffer.fromVertexArray( self.app.glx, self.pool.descriptor, {

                drawType    : self.app.gl.DYNAMIC_DRAW,  // TODO chosse vertex buffer type (static,dynamic or stream?)
                vertexArray : self.pool.vertexArray

            });

            self.indexArray = VertexIndexArray.Generate( self.pool.capacity, [ 0,1,2, 0,2,3 ] );
            self.webGlIndexBuffer = WebGlBuffer.fromVertexIndexArray( self.app.glx, self.indexArray );

        }

    }


    function initRenderCmds ( self ) {
    
        if ( ! self.renderCmdObj ) {

            self.renderCmdObj = new utils.ObjectPool( function () {

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
    
    }


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
