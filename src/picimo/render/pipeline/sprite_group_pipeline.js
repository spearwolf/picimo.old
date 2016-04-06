'use strict';

import * as utils from '../../utils';
import { VertexIndexArray } from '../../core';
import WebGlBuffer from '../web_gl_buffer';

// TODO - buffer update strategy ( all-at-once, blocks, ..? )

export default class SpriteGroupPipeline {

    indexArray       = null;
    webGlBuffer      = null;
    webGlIndexBuffer = null;
    renderCmd        = null;

    constructor (app, program, pool, texture) {

        utils.object.definePropertiesPrivateRO(this, {

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

        //if (this.app.renderer.debugOutFrame) {
            //console.debug('spriteGroupPipeline.render()');
        //}

        this.app.renderer.addRenderCommand(this.renderCmd, this);

    }

    finish () {

        //if (this.app.renderer.debugOutFrame) {
            //console.debug('spriteGroupPipeline.finish()');
        //}

        this.webGlBuffer.bufferSubData();  // TODO always upload the complete vertex buffer - is this a good idea?

    }

}  // => end of class


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

    if ( ! self.renderCmd ) {

        self.renderCmd = {

            program: self.program,
            uniforms: {
                tex: self.app.textureManager.findOrCreateWebGlTexture( self.texture )
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

        Object.seal( self.renderCmd );

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

