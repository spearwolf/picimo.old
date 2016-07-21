'use strict';

import * as utils from '../../utils';
import { VertexIndexArray } from '../../core';
import WebGlBuffer from '../web_gl_buffer';

export default class PicturePipeline {

    static DEFAULT_CAPACITY = 100;

    indexArray       = null;
    webGlBuffer      = null;
    webGlIndexBuffer = null;
    renderCmd        = null;

    constructor (app, pool, texture, program) {

        utils.object.definePropertiesPrivateRO( this, {
            app     : app,
            pool    : pool,
            texture : texture,
            program : program,
        });

        // TODO init pool.NEW ?

        this.reset();

        Object.seal( this );

    }

    get glTexture () {
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

        //if (this.app.renderer.debugOutFrame) {
            //console.debug('picturePipeline.flush()');
        //}

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

        //if (this.app.renderer.debugOutFrame) {
            //console.debug('picturePipeline.render()');
        //}

        this.app.renderer.activatePipeline(this);

        this.pool.vertexArray.copy(sprite, this.totalSpritesCount);

        this.currentSpriteCount++;
        this.totalSpritesCount++;

    }

    finish () {

        //if (this.app.renderer.debugOutFrame) {
            //console.debug('picturePipeline.finish()');
        //}

        if (this.totalSpritesCount) {
            this.flush();
            this.webGlBuffer.bufferSubData(null, this.totalSpritesCount * this.pool.descriptor.vertexAttrCount * this.pool.descriptor.vertexCount);
        }

    }

}


function initBuffers ( self ) {

    if ( ! self.webGlBuffer ) {

        self.webGlBuffer = WebGlBuffer.fromVertexArray( self.app.glx, self.pool.descriptor, {

            drawType    : self.app.gl.DYNAMIC_DRAW,  // TODO chosse vertex buffer type (static,dynamic or stream?)
            vertexArray : self.pool.vertexArray

        });

        self.indexArray = VertexIndexArray.Generate( self.pool.capacity, [ 0, 1, 2, 0, 2, 3 ] );
        self.webGlIndexBuffer = WebGlBuffer.fromVertexIndexArray( self.app.glx, self.indexArray );

    }

}


function initRenderCmds ( self ) {

    if ( self.renderCmd ) return;

    self.renderCmd = new utils.ObjectPool(() => {

        var obj = {

            program: self.program,
            uniforms: {
                //tex: self.app.textureManager.findOrCreateWebGlTexture( self.texture )
                tex: self.glTexture
            },
            attributes: {},
            drawElements: {
                buffer: self.webGlIndexBuffer,
                elementType: self.app.gl.TRIANGLES,
                count: 0,
                offset: 0
            }

        };

        var name, attr = self.pool.descriptor.attr;

        for ( name in attr) {

            if ( attr.hasOwnProperty( name ) ) {

                obj.attributes[ name ] = {
                    offset : attr[ name ].offset,
                    size   : attr[ name ].size,
                    stride : self.pool.descriptor.vertexAttrCount,
                    buffer : self.webGlBuffer,
                };

            }

        }

        Object.seal( obj );

        return obj;

    });

}

