import { definePropertiesPrivateRO } from '../../utils/object_utils';
import ObjectPool from '../../utils/object_pool';
import { VertexIndexArray } from '../../core';
import WebGlBuffer from '../web_gl_buffer';

export default class PicturePipeline {

    constructor (app, pool, texture, program) {

        this.indexArray       = null;
        this.webGlBuffer      = null;
        this.webGlIndexBuffer = null;
        this.renderCmd        = null;

        definePropertiesPrivateRO( this, {
            app     : app,
            pool    : pool,
            texture : texture,
            program : program,
        });

        // TODO init pool.NEW ?

        this.reset();

        Object.seal( this );

    }

    get webGlTexture () {
        return this.app.textureManager.findOrCreateWebGlTexture( this.texture );
    }

    onInitGl () {
        initBuffers(this);
        initRenderCmds(this);
    }

    reset () {
        this.currentSpriteCount = 0;
        this.currentSpriteOffset = 0;
        this.totalSpritesCount = 0;
        if (this.renderCmd) this.renderCmd.releaseAll();
    }

    flush () {
        if (this.currentSpriteCount) {

            let cmd = this.renderCmd.create();

            cmd.drawElements.count = this.currentSpriteCount;
            cmd.drawElements.offset = this.currentSpriteOffset;

            this.app.renderer.addRenderCommand(cmd, this);

            this.currentSpriteOffset += this.currentSpriteCount;
            this.currentSpriteCount = 0;
        }
    }

    render (sprite) {
        this.app.renderer.activatePipeline(this);

        this.pool.vertexArray.copy(sprite, this.totalSpritesCount);

        ++this.currentSpriteCount;
        ++this.totalSpritesCount;
    }

    finish () {
        if (this.totalSpritesCount) {
            this.flush();
            this.webGlBuffer.bufferSubData(null, this.totalSpritesCount * this.pool.descriptor.vertexAttrCount * this.pool.descriptor.vertexCount);
        }
    }

}

PicturePipeline.DEFAULT_CAPACITY = 100;


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


function initRenderCmds ( pipeline ) {

    if ( pipeline.renderCmd ) return;

    pipeline.renderCmd = new ObjectPool(() => {

        var obj = {

            program: pipeline.program,
            uniforms: {
                tex: pipeline.webGlTexture
            },
            attributes: {},
            drawElements: {
                buffer: pipeline.webGlIndexBuffer,
                elementType: pipeline.app.gl.TRIANGLES,
                count: 0,
                offset: 0
            }

        };

        var name, attr = pipeline.pool.descriptor.attr;

        for ( name in attr) {

            if ( attr.hasOwnProperty( name ) ) {

                obj.attributes[ name ] = {
                    offset : attr[ name ].offset,
                    size   : attr[ name ].size,
                    stride : pipeline.pool.descriptor.vertexAttrCount,
                    buffer : pipeline.webGlBuffer,
                };

            }

        }

        Object.seal( obj );

        return obj;

    });

}

