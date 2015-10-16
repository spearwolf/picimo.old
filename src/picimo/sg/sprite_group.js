'use strict';

import Node from './node';
import core from '../core';
import sprites from '../sprites';
import {SpriteGroupPipeline} from '../webgl/pipeline';

/**
 * @class Picimo.sg.SpriteGroup
 * @extends Picimo.sg.Node
 *
 * @param {Picimo.App} app - The app instance
 * @param {object} [options] - The options
 * @param {Picimo.core.TextureAtlas|Promise} [options.textureAtlas]
 * @param {string} [options.program="sprite"] - The webgl program name
 * @param {number} [options.capacity=1000] - Max sprite capacity
 * @param {Picimo.core.VertexObjectDescriptor} [options.spriteDescriptor=Picimo.sprites.SpriteDescriptor]
 *
 * @summary
 * Represents a group of sprites.
 *
 * @classdesc
 * A SpriteGroup renders a group of sprites to the screen.
 * All vertex data will be will be uploaded to the GPU *every frame*.
 * So choose the capacity carefully.
 *
 * A SpriteGroup expects that a sprite instance (which is described by the *spriteDescriptor* option) has the following properties and methods:
 *
 * | Type | Definition | Required | Comment |
 * |------|------------|----------|---------|
 * | Method | `setTexCoords(x0, y0, x1, y1, x2, y2, x3, y3)` | yes | |
 * | Method | `setSize(w, h)` | yes | |
 * | Method | `setScale(sx, sy)` | no | Either this or *scale* |
 * | Property | `scale=` | no | Either this or *setScale* |
 * | Property | `opacity=` | no | |
 *
 */

export default function SpriteGroup ( app, options ) {

    if ( options === undefined ) options = {};

    Node.call( this, app, options );

    initTextureAtlas( this, options.textureAtlas );

    this.program             = options.program || "sprite";
    this.spriteDescriptor    = options.spriteDescriptor || sprites.SpriteDescriptor;
    this.pipeline            = null;
    this.defaultSpriteWidth  = options.defaultWidth || 0;
    this.defaultSpriteHeight = options.defaultHeight || options.defaultWidth;

    initSpritePool( this, this.spriteDescriptor, options.capacity || 1000 );

    this.on( "initGl", onInitGl.bind( this, this ) );
    this.on( "renderFrame", -1000, onRenderFrame.bind( this, this ) );

}

SpriteGroup.prototype = Object.create( Node.prototype );
SpriteGroup.prototype.constructor = SpriteGroup;


/**
 * @method Picimo.sg.SpriteGroup#createSprite
 *
 * @param {string|Picimo.core.Texture} [texture]
 * @param {number} [width]
 * @param {number} [height]
 *
 * @returns {Picimo.sprites.Sprite} sprite
 *
 * @throws  If pool capacity is reached an error will be thrown.
 *
 * @description
 * Returns a sprite from the internal sprite pool. If pool capacity is reached an error will be thrown.
 *
 * If no *width* or *height* given the size will be read out from the texture.
 * Otherwise when you previously called `setDefaultSpriteSize(w, h)` the default width and height will be used.
 *
 * If no *texture* is given a random texture (from the *textureAtlas*) will be choosen.
 *
 */

SpriteGroup.prototype.createSprite = function ( texture, width, height ) {

    var sprite = this.pool.alloc();

    var tex = typeof texture === 'string'
        ? this.textureAtlas.getTexture( texture )
        : ( texture == null
            ? this.textureAtlas.getRandomTexture()
            : texture );

    tex.setTexCoords( sprite );

    if ( width === undefined ) {

        if ( this.hasDefaultSpriteSize || ! tex ) {

            return sprite;

        }

        width = tex.width;
        height = tex.height;

    } else {

        if ( height === undefined ) height = width;

    }

    sprite.setSize( width, height );

    return sprite;

};

/**
 * @method Picimo.sg.SpriteGroup#setDefaultSpriteSize
 *
 * @param {number} width
 * @param {number} height
 *
 * @returns {Picimo.sg.SpriteGroup} *self*
 *
 * @see Picimo.sg.SpriteGroup#createSprite
 *
 * @description
 * Set the width and height for all new sprites. Note that this won't affect any previously created sprites.
 *
 */

SpriteGroup.prototype.setDefaultSpriteSize = function ( width, height ) {

    this.defaultSpriteWidth = width || 0;
    this.defaultSpriteHeight = height || width;

    updateDefaultSpriteSize( this );

};


function initSpritePool ( spriteGroup, descriptor, capacity ) {

    spriteGroup.pool = new core.VertexObjectPool( descriptor, capacity );

    var newSpritePrototype = spriteGroup.pool.NEW;

    if ( descriptor.hasAttribute( 'scale', 1 ) ) newSpritePrototype.scale = 1;
    else if ( descriptor.hasAttribute( 'scale', 2 ) ) newSpritePrototype.setScale( 1, 1 );
    if ( descriptor.hasAttribute( 'opacity' ) ) newSpritePrototype.opacity = 1;

    updateDefaultSpriteSize( spriteGroup );

}

function updateDefaultSpriteSize ( spriteGroup ) {

    if ( spriteGroup.hasDefaultSpriteSize ) {

        spriteGroup.pool.NEW.setSize( spriteGroup.defaultSpriteWidth, spriteGroup.defaultSpriteHeight );

    }

}

function initTextureAtlas ( spriteGroup, textureAtlas ) {

    spriteGroup.textureAtlas = null;
    spriteGroup.setReadyFunc( false );

    Promise.resolve( textureAtlas )

        .then( function ( atlas ) {

                spriteGroup.textureAtlas = atlas;
                return atlas.promise;

            })
        .then ( function ( atlas ) { return atlas.texture.image.promise })
        .then ( function () { spriteGroup.setReadyFunc( true ) });

}

function onInitGl ( spriteGroup ) {

    spriteGroup.pipeline = new SpriteGroupPipeline( spriteGroup.app, spriteGroup.program, spriteGroup.pool, spriteGroup.textureAtlas );
    spriteGroup.pipeline.onInitGl();
    spriteGroup.app.renderer.addPipeline( spriteGroup.pipeline );

}

function onRenderFrame ( spriteGroup ) {

    spriteGroup.pipeline.render();

}

Object.defineProperties( SpriteGroup.prototype, {

    "textureAtlas": {

        get: function () { return this._textureAtlas; },

        set: function ( ta ) {

            this._textureAtlas = ta;

            if ( ta instanceof core.TextureAtlas ) {

                this.ready = true;

            } else {

                this.ready = false;

                if ( ta && ta.then ) {

                    var self = this;

                    ta.then( function ( ta_ ) {

                        self.textureAtlas = ta_;

                    });

                }

            }

        }

    },

    'hasDefaultSpriteSize': {

        get: function () {

            return this.defaultSpriteWidth > 0 && this.defaultSpriteHeight > 0;

        }

    }

});

