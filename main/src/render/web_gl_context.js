'use strict';

import * as utils from '../utils';

export default class WebGlContext {

    constructor ( gl ) {

        if ( ! gl ) throw new Error( '[new Picimo.render.WebGlContext] gl is undefined!' );

        utils.object.definePropertyPublicRO( this, 'gl', gl );

        utils.object.definePropertiesPrivateRO( this, {
            '_boundBuffers' : new Map,
            '_shaders'      : new Map,
            '_programs'     : new Map
        });

        fetchExtensions( this );
        readWebGlParameters( this );

        this.app           = null;
        this.activeProgram = null;

        this.activeTexture( 0 );
        this._boundTextures = [];

        for ( let i = 0; i < this.MAX_TEXTURE_IMAGE_UNITS; i++ ) {

            this._boundTextures[ i ] = { TEXTURE_2D: null };

        }

        Object.seal( this );

    }

    activeTexture ( texUnit ) {

        const gl = this.gl;
        const tex = gl.TEXTURE0 + texUnit;

        if ( this.activeTexUnit !== tex ) {

            this.activeTexUnit = tex;
            gl.activeTexture( this.activeTexUnit );

        }

    }

    bindTexture2d ( texture ) {

        const gl = this.gl;
        const boundTextures = this._boundTextures[ this.activeTexUnit - gl.TEXTURE0 ];

        if ( boundTextures.TEXTURE_2D !== texture ) {

            boundTextures.TEXTURE_2D = texture;

            gl.bindTexture( gl.TEXTURE_2D, texture );

        }

    }

    bindBuffer ( bufferType, buffer ) {

        if ( this._boundBuffers.get( bufferType ) !== buffer ) {

            this._boundBuffers.set( bufferType, buffer );
            this.gl.bindBuffer( bufferType, buffer );

        }

    }

    bindArrayBuffer ( buffer ) {

        this.bindBuffer( this.gl.ARRAY_BUFFER, buffer );

    }

    bindElementArrayBuffer ( buffer ) {

        this.bindBuffer( this.gl.ELEMENT_ARRAY_BUFFER, buffer );

    }

    glShader ( shader ) {

        if ( ! shader ) return;

        let glShader = this._shaders.get( shader.uid );
        if ( ! glShader ) {

            glShader = shader.compile( this );
            if ( glShader ) {

                this._shaders.set( shader.uid, glShader );

            }

        }

        return glShader;

    }

    glProgram ( program ) {

        if ( ! program ) return;

        let glProgram = this._programs.get( program.uid );
        if ( ! glProgram ) {

            glProgram = program.linkProgram( this.app );
            if ( glProgram ) {

                this._programs.set( program.uid, glProgram );

            }

        }

        return glProgram;

    }

}  // => WebGlContext



function readWebGlParameters ( webGlContext ) {

    const gl = webGlContext.gl;
    utils.object.definePropertiesPublicRO( webGlContext, {

        MAX_TEXTURE_SIZE        : gl.getParameter( gl.MAX_TEXTURE_SIZE ),
        MAX_TEXTURE_IMAGE_UNITS : gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS )

    });

}

function fetchExtensions ( webGlContext ) {

    webGlContext.OES_element_index_uint = webGlContext.gl.getExtension("OES_element_index_uint");
    if ( ! webGlContext.OES_element_index_uint ) {

        console.error( "WebGL don't support the OES_element_index_uint extension!" );

    }

}

