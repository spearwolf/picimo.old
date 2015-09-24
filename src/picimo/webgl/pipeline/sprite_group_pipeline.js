(function(){
    "use strict";

    var utils            = require( '../../utils' );
    var VertexIndexArray = require( '../../core/vertex_index_array.js' );
    var WebGlBuffer      = require( '../web_gl_buffer' );

    /**
     * @class Picimo.webgl.pipeline.SpriteGroupPipeline
     *
     * @description
     *
     *   TODO
     *     - update strategy ( all-at-once, blocks, ..? )
     *
     */

    function SpriteGroupPipeline ( app, program, pool, texture ) {

        utils.object.definePropertiesPrivateRO( this, {

            app     : app,
            program : program,
            pool    : pool,
            texture : texture,

        });

        reset( this );

        // TODO
        // - texture(s)

        this.indexArray       = null;
        this.webGlBuffer      = null;
        this.webGlIndexBuffer = null;
        this.renderCmd        = null;

        Object.seal( this );

    }


    SpriteGroupPipeline.prototype.initGl = function () {

        initBuffers( this );
        initRenderCmds( this );

    };


    SpriteGroupPipeline.prototype.render = function () {

        this.app.renderer.add( this.renderCmd );

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

        if ( ! self.renderCmd ) {

            self.renderCmd = {

                program: self.program,
                uniforms: {
                    tex: self.app.texture.findOrCreateWebGlTexture( self.texture )
                },
                attributes: {},
                drawElements: {
                    buffer: self.webGlIndexBuffer,
                    elementType: self.app.gl.TRIANGLES
                }

            };

            var name, attr = self.pool.descriptor.attr;

            for ( name in attr) {

                if ( attr.hasOwnProperty( name ) ) {

                    self.renderCmd.attributes[ name ] = {
                        offset : attr[ name ].offset,
                        size   : attr[ name ].size,
                        stride : self.pool.descriptor.vertexAttrCount,
                        buffer : self.webGlBuffer,
                    };

                }

            }

            Object.seal( self.renderCmdj );

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
