/* jshint esversion:6 */
import WebGlBuffer from '../web_gl_buffer';
import VertexIndexArray from '../../core/vertex_index_array';
import { definePropertiesPrivateRO } from '../../utils/obj_props';

// TODO - buffer update strategy ( all-at-once, blocks, ..? )

export default class SpriteGroupPipeline {

    constructor (app, program, pool, texture) {

        this.indexArray       = null;
        this.webGlBuffer      = null;
        this.webGlIndexBuffer = null;
        this.renderCmd        = null;

        definePropertiesPrivateRO(this, {

            app     : app,
            program : program,
            pool    : pool,
            texture : texture,

        });

        Object.seal( this );

    }

    onInitGl () {
        initBuffers(this);
        initRenderCmds(this);
    }

    render () {

        this.app.renderer.addRenderCommand(this.renderCmd, this);

    }

    finish () {

        this.webGlBuffer.bufferSubData();  // TODO always upload the complete vertex buffer - is this a good idea?

    }

}  // => SpriteGroupPipeline


/**
 * @ignore
 */
function initBuffers ( pipeline ) {

    if ( ! pipeline.webGlBuffer ) {

        pipeline.webGlBuffer = WebGlBuffer.fromVertexArray( pipeline.app.glx, pipeline.pool.descriptor, {

            drawType    : pipeline.app.gl.DYNAMIC_DRAW,  // TODO chosse vertex buffer type (static,dynamic or stream?)
            vertexArray : pipeline.pool.vertexArray

        });

        pipeline.indexArray = VertexIndexArray.Generate( pipeline.pool.capacity, [ 0, 1, 2, 0, 2, 3 ] );
        pipeline.webGlIndexBuffer = WebGlBuffer.fromVertexIndexArray( pipeline.app.glx, pipeline.indexArray );

    }

}


/**
 * @ignore
 */
function initRenderCmds ( pipeline ) {

    if ( ! pipeline.renderCmd ) {

        pipeline.renderCmd = {

            program: pipeline.program,
            uniforms: {
                tex: pipeline.app.textureManager.findOrCreateWebGlTexture( pipeline.texture )
            },
            attributes: {},
            drawElements: {
                buffer: pipeline.webGlIndexBuffer,
                elementType: pipeline.app.gl.TRIANGLES
            }

        };

        var name, attr = pipeline.pool.descriptor.attr;

        for ( name in attr) {

            if ( attr.hasOwnProperty( name ) ) {

                pipeline.renderCmd.attributes[ name ] = {
                    offset : attr[ name ].offset,
                    size   : attr[ name ].size,
                    stride : pipeline.pool.descriptor.vertexAttrCount,
                    buffer : pipeline.webGlBuffer,
                };

            }

        }

        Object.seal( pipeline.renderCmd );

    }

}


//function reset ( pipeline ) {

    //pipeline.currentSpriteCount  = 0;
    //pipeline.currentSpriteOffset = 0;
    //pipeline.totalSpritesCount   = 0;
    //pipeline.texture             = null;
    //pipeline.currentProgram      = null;

    //if ( pipeline.renderCmdObj ) pipeline.renderCmdObj.releaseAll();

//}

